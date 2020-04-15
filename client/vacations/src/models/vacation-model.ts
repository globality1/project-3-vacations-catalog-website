export class VacationModel {

    public constructor(
        public id?: number,
        public vacationName?: string, 
        public description?: string, 
        public destination?: string, 
        public imageFile?: File, 
        public imageFileName?: string,
        public startDate?: string, 
        public endDate?: string, 
        public price?: number) {
    }
}


