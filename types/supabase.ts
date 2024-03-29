export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      address: {
        Row: {
          address_type: Database["public"]["Enums"]["address_type"]
          barangay: string | null
          city: string | null
          created_at: string
          enrollment_application_id: string | null
          id: string
          province: string | null
          street: string | null
          subdivision: string | null
          unit_number: string | null
          zip: string | null
        }
        Insert: {
          address_type: Database["public"]["Enums"]["address_type"]
          barangay?: string | null
          city?: string | null
          created_at?: string
          enrollment_application_id?: string | null
          id?: string
          province?: string | null
          street?: string | null
          subdivision?: string | null
          unit_number?: string | null
          zip?: string | null
        }
        Update: {
          address_type?: Database["public"]["Enums"]["address_type"]
          barangay?: string | null
          city?: string | null
          created_at?: string
          enrollment_application_id?: string | null
          id?: string
          province?: string | null
          street?: string | null
          subdivision?: string | null
          unit_number?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "address_enrollment_application_id_fkey"
            columns: ["enrollment_application_id"]
            isOneToOne: false
            referencedRelation: "enrollment_application"
            referencedColumns: ["enrollment_application_id"]
          }
        ]
      }
      audit_trail: {
        Row: {
          action: Database["public"]["Enums"]["actions"] | null
          allow_resubmission: boolean | null
          created_at: string
          is_ok_changes: boolean | null
          message: string | null
          performer_id: string | null
          performer_name: string | null
          student: string
        }
        Insert: {
          action?: Database["public"]["Enums"]["actions"] | null
          allow_resubmission?: boolean | null
          created_at?: string
          is_ok_changes?: boolean | null
          message?: string | null
          performer_id?: string | null
          performer_name?: string | null
          student: string
        }
        Update: {
          action?: Database["public"]["Enums"]["actions"] | null
          allow_resubmission?: boolean | null
          created_at?: string
          is_ok_changes?: boolean | null
          message?: string | null
          performer_id?: string | null
          performer_name?: string | null
          student?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_trail_performer_id_fkey"
            columns: ["performer_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_trail_student_fkey"
            columns: ["student"]
            isOneToOne: true
            referencedRelation: "subject_assessment"
            referencedColumns: ["subject_assessment_id"]
          }
        ]
      }
      contact: {
        Row: {
          contact_id: string
          created_at: string
          email: string | null
          landline: string | null
          mobile: string | null
        }
        Insert: {
          contact_id: string
          created_at?: string
          email?: string | null
          landline?: string | null
          mobile?: string | null
        }
        Update: {
          contact_id?: string
          created_at?: string
          email?: string | null
          landline?: string | null
          mobile?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: true
            referencedRelation: "enrollment_application"
            referencedColumns: ["enrollment_application_id"]
          }
        ]
      }
      enrollment_application: {
        Row: {
          admission_type: string | null
          attachment: string[] | null
          created_at: string
          enrollment_application_id: string
          id_number: string | null
          lrn: string | null
          program: string | null
          status: Database["public"]["Enums"]["status"] | null
          year_level: string | null
        }
        Insert: {
          admission_type?: string | null
          attachment?: string[] | null
          created_at?: string
          enrollment_application_id: string
          id_number?: string | null
          lrn?: string | null
          program?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          year_level?: string | null
        }
        Update: {
          admission_type?: string | null
          attachment?: string[] | null
          created_at?: string
          enrollment_application_id?: string
          id_number?: string | null
          lrn?: string | null
          program?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          year_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollment_application_enrollment_application_id_fkey"
            columns: ["enrollment_application_id"]
            isOneToOne: true
            referencedRelation: "user_infomation"
            referencedColumns: ["user_id"]
          }
        ]
      }
      last_school: {
        Row: {
          created_at: string
          graduate_date: string | null
          last_school_id: string
          level: string | null
          name: string | null
          program: string | null
          term: string | null
          type: string | null
          year: string | null
        }
        Insert: {
          created_at?: string
          graduate_date?: string | null
          last_school_id: string
          level?: string | null
          name?: string | null
          program?: string | null
          term?: string | null
          type?: string | null
          year?: string | null
        }
        Update: {
          created_at?: string
          graduate_date?: string | null
          last_school_id?: string
          level?: string | null
          name?: string | null
          program?: string | null
          term?: string | null
          type?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "last_school_last_school_id_fkey"
            columns: ["last_school_id"]
            isOneToOne: true
            referencedRelation: "enrollment_application"
            referencedColumns: ["enrollment_application_id"]
          }
        ]
      }
      otp: {
        Row: {
          created_at: string
          email: string
          expired_at: string
          id: string
          otp: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          expired_at: string
          id?: string
          otp: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          expired_at?: string
          id?: string
          otp?: string
          user_id?: string
        }
        Relationships: []
      }
      parent: {
        Row: {
          created_at: string
          email: string | null
          enrollment_application_id: string | null
          firstname: string | null
          id: string
          lastname: string | null
          middlename: string | null
          mobile: string | null
          occupation: string | null
          relation: string | null
          role: Database["public"]["Enums"]["parent_role"] | null
          suffix: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          enrollment_application_id?: string | null
          firstname?: string | null
          id?: string
          lastname?: string | null
          middlename?: string | null
          mobile?: string | null
          occupation?: string | null
          relation?: string | null
          role?: Database["public"]["Enums"]["parent_role"] | null
          suffix?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          enrollment_application_id?: string | null
          firstname?: string | null
          id?: string
          lastname?: string | null
          middlename?: string | null
          mobile?: string | null
          occupation?: string | null
          relation?: string | null
          role?: Database["public"]["Enums"]["parent_role"] | null
          suffix?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_enrollment_application_id_fkey"
            columns: ["enrollment_application_id"]
            isOneToOne: false
            referencedRelation: "enrollment_application"
            referencedColumns: ["enrollment_application_id"]
          }
        ]
      }
      registration: {
        Row: {
          contact: string
          created_at: string
          email: string
          firstname: string
          id: string
          last_school: string | null
          lastname: string
          middlename: string
          student_number: string | null
          student_type: Database["public"]["Enums"]["student_type"]
          suffix: string
          verified: boolean
        }
        Insert: {
          contact: string
          created_at?: string
          email?: string
          firstname?: string
          id?: string
          last_school?: string | null
          lastname?: string
          middlename?: string
          student_number?: string | null
          student_type: Database["public"]["Enums"]["student_type"]
          suffix?: string
          verified?: boolean
        }
        Update: {
          contact?: string
          created_at?: string
          email?: string
          firstname?: string
          id?: string
          last_school?: string | null
          lastname?: string
          middlename?: string
          student_number?: string | null
          student_type?: Database["public"]["Enums"]["student_type"]
          suffix?: string
          verified?: boolean
        }
        Relationships: []
      }
      rel_subject_subject_assessment: {
        Row: {
          created_at: string
          id: string
          subject_assessment_id: string
          subject_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          subject_assessment_id: string
          subject_id: string
        }
        Update: {
          created_at?: string
          id?: string
          subject_assessment_id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rel_subject_subject_assessment_subject_assessment_id_fkey"
            columns: ["subject_assessment_id"]
            isOneToOne: false
            referencedRelation: "subject_assessment"
            referencedColumns: ["subject_assessment_id"]
          },
          {
            foreignKeyName: "rel_subject_subject_assessment_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subject"
            referencedColumns: ["id"]
          }
        ]
      }
      student_information: {
        Row: {
          birth_date: string | null
          birth_place: string | null
          citizenship: string | null
          civil_status: string | null
          created_at: string
          firstname: string | null
          gender: string | null
          lastname: string | null
          middlename: string | null
          student_info_id: string
          suffix: string | null
        }
        Insert: {
          birth_date?: string | null
          birth_place?: string | null
          citizenship?: string | null
          civil_status?: string | null
          created_at?: string
          firstname?: string | null
          gender?: string | null
          lastname?: string | null
          middlename?: string | null
          student_info_id: string
          suffix?: string | null
        }
        Update: {
          birth_date?: string | null
          birth_place?: string | null
          citizenship?: string | null
          civil_status?: string | null
          created_at?: string
          firstname?: string | null
          gender?: string | null
          lastname?: string | null
          middlename?: string | null
          student_info_id?: string
          suffix?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_information_student_info_id_fkey"
            columns: ["student_info_id"]
            isOneToOne: true
            referencedRelation: "enrollment_application"
            referencedColumns: ["enrollment_application_id"]
          }
        ]
      }
      subject: {
        Row: {
          created_at: string
          id: string
          instructor: string | null
          program: string | null
          section: string | null
          subject_code: string | null
          subject_name: string | null
          type: string
          units: string | null
          year_level: Database["public"]["Enums"]["year_level"] | null
        }
        Insert: {
          created_at?: string
          id?: string
          instructor?: string | null
          program?: string | null
          section?: string | null
          subject_code?: string | null
          subject_name?: string | null
          type?: string
          units?: string | null
          year_level?: Database["public"]["Enums"]["year_level"] | null
        }
        Update: {
          created_at?: string
          id?: string
          instructor?: string | null
          program?: string | null
          section?: string | null
          subject_code?: string | null
          subject_name?: string | null
          type?: string
          units?: string | null
          year_level?: Database["public"]["Enums"]["year_level"] | null
        }
        Relationships: []
      }
      subject_assessment: {
        Row: {
          created_at: string
          print_status: Database["public"]["Enums"]["printing_status"] | null
          program: string | null
          section: string | null
          status: Database["public"]["Enums"]["status"] | null
          student_status: Database["public"]["Enums"]["student_status"] | null
          subject_assessment_id: string
          year: string | null
        }
        Insert: {
          created_at?: string
          print_status?: Database["public"]["Enums"]["printing_status"] | null
          program?: string | null
          section?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          student_status?: Database["public"]["Enums"]["student_status"] | null
          subject_assessment_id: string
          year?: string | null
        }
        Update: {
          created_at?: string
          print_status?: Database["public"]["Enums"]["printing_status"] | null
          program?: string | null
          section?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          student_status?: Database["public"]["Enums"]["student_status"] | null
          subject_assessment_id?: string
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subject_assessment_subject_assessment_id_fkey"
            columns: ["subject_assessment_id"]
            isOneToOne: true
            referencedRelation: "user_infomation"
            referencedColumns: ["user_id"]
          }
        ]
      }
      subject_schedule: {
        Row: {
          created_at: string
          day: Database["public"]["Enums"]["days"] | null
          end: string | null
          id: string
          room: string | null
          start: string | null
          subject_id: string | null
        }
        Insert: {
          created_at?: string
          day?: Database["public"]["Enums"]["days"] | null
          end?: string | null
          id?: string
          room?: string | null
          start?: string | null
          subject_id?: string | null
        }
        Update: {
          created_at?: string
          day?: Database["public"]["Enums"]["days"] | null
          end?: string | null
          id?: string
          room?: string | null
          start?: string | null
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subject_schedule_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subject"
            referencedColumns: ["id"]
          }
        ]
      }
      survey: {
        Row: {
          billboards: boolean | null
          camp: boolean | null
          created_at: string
          destination: boolean | null
          flyers: boolean | null
          others: boolean | null
          posters: boolean | null
          print: boolean | null
          radio: boolean | null
          referrals: boolean | null
          school_event: boolean | null
          seminar: boolean | null
          social_media: boolean | null
          survey_id: string
          tv: boolean | null
          website: boolean | null
        }
        Insert: {
          billboards?: boolean | null
          camp?: boolean | null
          created_at?: string
          destination?: boolean | null
          flyers?: boolean | null
          others?: boolean | null
          posters?: boolean | null
          print?: boolean | null
          radio?: boolean | null
          referrals?: boolean | null
          school_event?: boolean | null
          seminar?: boolean | null
          social_media?: boolean | null
          survey_id: string
          tv?: boolean | null
          website?: boolean | null
        }
        Update: {
          billboards?: boolean | null
          camp?: boolean | null
          created_at?: string
          destination?: boolean | null
          flyers?: boolean | null
          others?: boolean | null
          posters?: boolean | null
          print?: boolean | null
          radio?: boolean | null
          referrals?: boolean | null
          school_event?: boolean | null
          seminar?: boolean | null
          social_media?: boolean | null
          survey_id?: string
          tv?: boolean | null
          website?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: true
            referencedRelation: "enrollment_application"
            referencedColumns: ["enrollment_application_id"]
          }
        ]
      }
      user: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          password: string
          role: Database["public"]["Enums"]["auth_role"]
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          password: string
          role: Database["public"]["Enums"]["auth_role"]
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          password?: string
          role?: Database["public"]["Enums"]["auth_role"]
        }
        Relationships: []
      }
      user_infomation: {
        Row: {
          contact: string
          created_at: string
          email: string
          firstname: string
          last_school: string | null
          lastname: string
          middlename: string | null
          student_number: string | null
          student_type: Database["public"]["Enums"]["student_type"]
          suffix: string | null
          user_id: string
        }
        Insert: {
          contact: string
          created_at?: string
          email: string
          firstname: string
          last_school?: string | null
          lastname: string
          middlename?: string | null
          student_number?: string | null
          student_type: Database["public"]["Enums"]["student_type"]
          suffix?: string | null
          user_id: string
        }
        Update: {
          contact?: string
          created_at?: string
          email?: string
          firstname?: string
          last_school?: string | null
          lastname?: string
          middlename?: string | null
          student_number?: string | null
          student_type?: Database["public"]["Enums"]["student_type"]
          suffix?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_infomation_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      distinct_sections: {
        Row: {
          program: string | null
          section: string | null
          year_level: Database["public"]["Enums"]["year_level"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      actions: "approved" | "rejected" | "edited"
      address_type: "current" | "permanent"
      auth_role: "student" | "admission" | "assessor"
      days:
        | "Monday"
        | "Tuesday"
        | "Wednesday"
        | "Thursday"
        | "Friday"
        | "Saturday"
        | "Sunday"
      parent_role: "parent" | "guardian"
      printing_status: "for printing" | "pending" | "printed"
      status: "pending" | "approved" | "rejected"
      student_status: "regular" | "irregular"
      student_type: "new_student" | "old_student"
      year_level: "First Year" | "Second Year" | "Third Year" | "Fourth Year"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
