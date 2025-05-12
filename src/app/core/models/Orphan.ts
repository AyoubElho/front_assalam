import {Guardian} from './Guardian';

export interface Orphan {
  id: number;
  full_name: string;
  birth_date: string;
  mother_name: string;
  pic_orphan: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  guardian?: Guardian; // 👈 Define guardian as optional
}
