import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'loanTableFilter'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!args) {
      return value;
    }
    return value.filter((val) => {
      let rVal = (val[0].toLocaleLowerCase().includes(args)) || (val[1].toLocaleLowerCase().includes(args));
      return rVal;
    })

  }

}