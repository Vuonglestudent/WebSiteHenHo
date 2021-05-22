import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'agePipe'
})

export class AgePipe implements PipeTransform {
    transform(date: Date): string {

        console.log(date)
        if (date) {
            //convert date again to type Date
            const bdate = new Date(date);
            const timeDiff = Math.abs(Date.now() - bdate.getTime());
            var age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365).toString();
            return  age + " tuổi";
        }
    }
}