import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaFormal',
})
export class FechaFormalPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    const fecha = new Date(value);

    // Formato en español con Intl API
    const formato = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(fecha);

    // Capitaliza primera letra y reemplaza "de" por "del"
    const conCapital = formato.charAt(0).toUpperCase() + formato.slice(1);
    return conCapital.replace(/ de (\d{4})$/, ' del $1');
  }
}
