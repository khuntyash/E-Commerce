import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListCustomerCareTickets,
  useUpdateCustomerCareTicketStatus,
  getListCustomerCareTicketsQueryKey,
  type CustomerCareTicket,
} from "@workspace/api-client-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TOKEN_STORAGE_KEY = "cc_admin_token";
const PAGE_SIZE = 20;

type StatusFilter = "all" | "open" | "resolved";

function formatDate(value?: string | Date | null): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function StatusBadge({ status }: { status: string }) {
  return status === "resolved" ? (
    <Badge variant="secondary">Resolved</Badge>
  ) : (
    <Badge>Open</Badge>
  );
}

function TokenGate({ onSubmit }: { onSubmit: (token: string) => void }) {
  const [value, setValue] = useState("");
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4">
      <Card>
        <CardHeader>
          <CardTitle>Admin access</CardTitle>
          <CardDescription>
            Enter the admin token to view customer care submissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (value.trim()) onSubmit(value.trim());
            }}
          >
            <Input
              type="password"
              placeholder="Admin token"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
            />
            <Button type="submit" disabled={!value.trim()}>
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CustomerCareInbox() {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string>(
    () => localStorage.getItem(TOKEN_STORAGE_KEY) ?? "",
  );
  const [status, setStatus] = useState<StatusFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<CustomerCareTicket | null>(null);

  const params = useMemo(
    () => ({
      status,
      ...(search ? { q: search } : {}),
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    }),
    [status, search, page],
  );

  const requestOptions = useMemo(
    () => ({ headers: { "X-Admin-Token": token } }),
    [token],
  );

  const { data, isLoading, isError, error } = useListCustomerCareTickets(
    params,
    {
      request: requestOptions,
      query: {
        queryKey: getListCustomerCareTicketsQueryKey(params),
        enabled: Boolean(token),
        retry: false,
      },
    },
  );

  const updateStatus = useUpdateCustomerCareTicketStatus({
    request: requestOptions,
    mutation: {
      onSuccess: (updated) => {
        setSelected(updated);
        queryClient.invalidateQueries({
          queryKey: getListCustomerCareTicketsQueryKey().slice(0, 1),
        });
      },
    },
  });

  function saveToken(t: string) {
    localStorage.setItem(TOKEN_STORAGE_KEY, t);
    setToken(t);
  }

  function signOut() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken("");
  }

  const isUnauthorized =
    isError &&
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status?: number }).status === 401;

  if (!token || isUnauthorized) {
    return (
      <div className="min-h-screen bg-background py-8">
        {isUnauthorized && (
          <p className="mb-4 text-center text-sm text-destructive">
            That token was rejected. Please try again.
          </p>
        )}
        <TokenGate onSubmit={saveToken} />
      </div>
    );
  }

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Customer Care
          </h1>
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? "submission" : "submissions"}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          Sign out
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <form
              className="flex flex-1 gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setPage(0);
                setSearch(searchInput.trim());
              }}
            >
              <Input
                placeholder="Search name, email, topic, message…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="max-w-sm"
              />
              <Button type="submit" variant="secondary">
                Search
              </Button>
            </form>
            <Select
              value={status}
              onValueChange={(v) => {
                setPage(0);
                setStatus(v as StatusFilter);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Loading…
            </p>
          ) : items.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No submissions found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="text-muted-foreground">
                        {t.id}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{t.name || "—"}</div>
                        <div className="text-xs text-muted-foreground">
                          {t.email || ""}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate">
                        {t.topic}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {t.source}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={t.status} />
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(t.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelected(t)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selected.topic}
                  <StatusBadge status={selected.status} />
                </DialogTitle>
                <DialogDescription>
                  Ticket #{selected.id} · {selected.source}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-muted-foreground">Name</span>
                  <span className="col-span-2">{selected.name || "—"}</span>
                  <span className="text-muted-foreground">Email</span>
                  <span className="col-span-2 break-all">
                    {selected.email || "—"}
                  </span>
                  <span className="text-muted-foreground">Mobile</span>
                  <span className="col-span-2">{selected.mobile || "—"}</span>
                  <span className="text-muted-foreground">User ID</span>
                  <span className="col-span-2">
                    {selected.sourceUserId ?? "—"}
                  </span>
                  <span className="text-muted-foreground">Submitted</span>
                  <span className="col-span-2">
                    {formatDate(selected.submittedAt)}
                  </span>
                  <span className="text-muted-foreground">Received</span>
                  <span className="col-span-2">
                    {formatDate(selected.createdAt)}
                  </span>
                </div>
                <div>
                  <div className="mb-1 text-muted-foreground">Message</div>
                  <div className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3">
                    {selected.message}
                  </div>
                </div>
              </div>

              <DialogFooter>
                {selected.status === "resolved" ? (
                  <Button
                    variant="outline"
                    disabled={updateStatus.isPending}
                    onClick={() =>
                      updateStatus.mutate({
                        id: selected.id,
                        data: { status: "open" },
                      })
                    }
                  >
                    Reopen
                  </Button>
                ) : (
                  <Button
                    disabled={updateStatus.isPending}
                    onClick={() =>
                      updateStatus.mutate({
                        id: selected.id,
                        data: { status: "resolved" },
                      })
                    }
                  >
                    Mark as resolved
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
