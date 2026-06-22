import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListCustomerCareTickets,
  useUpdateCustomerCareTicketStatus,
  useGetCustomerCareTicket,
  useAddCustomerCareReply,
  getListCustomerCareTicketsQueryKey,
  getGetCustomerCareTicketQueryKey,
  type CustomerCareTicket,
  type CustomerCareReply,
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
import { Textarea } from "@/components/ui/textarea";

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
        // Include token in the key so a corrected token triggers a fresh fetch
        // instead of reusing a cached 401 from a previous attempt.
        queryKey: [...getListCustomerCareTicketsQueryKey(params), token],
        enabled: Boolean(token),
        retry: false,
      },
    },
  );

  function invalidateList() {
    void queryClient.invalidateQueries({
      queryKey: getListCustomerCareTicketsQueryKey().slice(0, 1),
    });
  }

  function saveToken(t: string) {
    const clean = t.trim();
    localStorage.setItem(TOKEN_STORAGE_KEY, clean);
    setToken(clean);
    void queryClient.removeQueries({
      queryKey: getListCustomerCareTicketsQueryKey().slice(0, 1),
    });
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

      {selected && (
        <TicketDialog
          ticket={selected}
          token={token}
          onClose={() => setSelected(null)}
          onChanged={invalidateList}
        />
      )}
    </div>
  );
}

function ReplyBubble({ reply }: { reply: CustomerCareReply }) {
  const isAdmin = reply.authorRole === "admin";
  return (
    <div className={isAdmin ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          "max-w-[80%] rounded-lg px-3 py-2 text-sm " +
          (isAdmin
            ? "bg-primary text-primary-foreground"
            : "border bg-muted/30")
        }
      >
        <div className="mb-1 text-[11px] opacity-70">
          {isAdmin ? "Support" : "User"} · {formatDate(reply.createdAt)}
        </div>
        <div className="whitespace-pre-wrap">{reply.body}</div>
      </div>
    </div>
  );
}

function TicketDialog({
  ticket,
  token,
  onClose,
  onChanged,
}: {
  ticket: CustomerCareTicket;
  token: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [replyText, setReplyText] = useState("");
  const requestOptions = useMemo(
    () => ({ headers: { "X-Admin-Token": token } }),
    [token],
  );

  const detailQuery = useGetCustomerCareTicket(ticket.id, {
    request: requestOptions,
    query: {
      queryKey: [...getGetCustomerCareTicketQueryKey(ticket.id), token],
      retry: false,
    },
  });

  const addReply = useAddCustomerCareReply({
    request: requestOptions,
    mutation: {
      onSuccess: () => {
        setReplyText("");
        void detailQuery.refetch();
        onChanged();
      },
    },
  });

  const updateStatus = useUpdateCustomerCareTicketStatus({
    request: requestOptions,
    mutation: {
      onSuccess: () => {
        void detailQuery.refetch();
        onChanged();
      },
    },
  });

  const detail = detailQuery.data;
  const status = detail?.status ?? ticket.status;
  const replies = detail?.replies ?? [];

  function sendReply() {
    const body = replyText.trim();
    if (!body) return;
    addReply.mutate({ id: ticket.id, data: { body } });
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="flex max-h-[85vh] max-w-lg flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {ticket.topic}
            <StatusBadge status={status} />
          </DialogTitle>
          <DialogDescription>
            Ticket #{ticket.id} · {ticket.source}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1 text-sm">
          <div className="grid grid-cols-3 gap-2">
            <span className="text-muted-foreground">Name</span>
            <span className="col-span-2">{ticket.name || "—"}</span>
            <span className="text-muted-foreground">Email</span>
            <span className="col-span-2 break-all">{ticket.email || "—"}</span>
            <span className="text-muted-foreground">Mobile</span>
            <span className="col-span-2">{ticket.mobile || "—"}</span>
            <span className="text-muted-foreground">User ID</span>
            <span className="col-span-2">{ticket.sourceUserId ?? "—"}</span>
            <span className="text-muted-foreground">Submitted</span>
            <span className="col-span-2">{formatDate(ticket.submittedAt)}</span>
          </div>

          <div>
            <div className="mb-1 text-muted-foreground">Message</div>
            <div className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3">
              {ticket.message}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-muted-foreground">
              Conversation {replies.length > 0 ? `(${replies.length})` : ""}
            </div>
            {detailQuery.isLoading ? (
              <p className="text-xs text-muted-foreground">Loading replies…</p>
            ) : replies.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No replies yet. Your reply will be shown to the user in their
                app.
              </p>
            ) : (
              <div className="space-y-2">
                {replies.map((r) => (
                  <ReplyBubble key={r.id} reply={r} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 border-t pt-3">
          <Textarea
            placeholder="Write a reply to the user…"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") sendReply();
            }}
          />
          {addReply.isError && (
            <p className="text-xs text-destructive">
              Could not send the reply. Please try again.
            </p>
          )}
          <DialogFooter className="gap-2 sm:justify-between">
            {status === "resolved" ? (
              <Button
                variant="outline"
                disabled={updateStatus.isPending}
                onClick={() =>
                  updateStatus.mutate({
                    id: ticket.id,
                    data: { status: "open" },
                  })
                }
              >
                Reopen
              </Button>
            ) : (
              <Button
                variant="outline"
                disabled={updateStatus.isPending}
                onClick={() =>
                  updateStatus.mutate({
                    id: ticket.id,
                    data: { status: "resolved" },
                  })
                }
              >
                Mark as resolved
              </Button>
            )}
            <Button
              disabled={addReply.isPending || !replyText.trim()}
              onClick={sendReply}
            >
              {addReply.isPending ? "Sending…" : "Send reply"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
