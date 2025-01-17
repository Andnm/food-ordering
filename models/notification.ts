export interface NotificationState {
  noti_id: number;
  is_new: boolean;
  noti_title: string;
  noti_type: string;
  noti_describe: string;
  created_at: string;
}

export interface CreateNotiState extends Omit<NotificationState, 'noti_id'> {}

export interface UpdateNotiState extends Omit<CreateNotiState, 'created_at'> {}