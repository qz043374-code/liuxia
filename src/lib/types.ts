export interface Class {
  id: string
  invite_code: string
  school: string
  grade: string
  class_name: string
  creator_name: string
  password: string
  is_archived: boolean
  created_at: string
}

export interface Member {
  id: string
  class_id: string
  name: string
  is_submitted: boolean
  avatar_url: string
  profile_data: Record<string, any>
  joined_at: string
  updated_at: string
}
