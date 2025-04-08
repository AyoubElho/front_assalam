export class Orphan {
  full_name: string;
  birth_date: Date;
  pic_orphan: string;
  guardian_name: string;
  mother_name: string;

  constructor(full_name: string, birth_date: Date, guardian_name: string, pic_orphan: string, mother_name: string) {
    this.full_name = full_name;
    this.birth_date = birth_date;
    this.pic_orphan = pic_orphan
    this.guardian_name = guardian_name;
    this.mother_name = mother_name;
  }
}
