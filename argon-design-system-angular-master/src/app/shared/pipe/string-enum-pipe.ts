import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'stringEnum'
})
export class StringEnumPipe implements PipeTransform {
    transform(n: string): string {
        
        if(n === undefined){
            return "";
        }
        return n.replace(/_/g, " ");
    }
}