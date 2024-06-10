export interface Message {
    id?: string;
    sender_id: string;
    recipient_id: string;
    message: string;
    created_at?: string | null;
    updated_at?: string | null;
    sender_name?: string;
}