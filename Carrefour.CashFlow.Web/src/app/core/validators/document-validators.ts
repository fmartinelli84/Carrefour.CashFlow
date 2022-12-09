import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as EinValidator from 'ein-validator';
import * as ItinValidator from 'itin-validator';
import * as SsnValidator from 'ssn-validator';

export class DocumentValidators {
  public static cnpj_bra(control: AbstractControl): ValidationErrors | null {
    let error = null;

    if (control.valid && control.value) {
      if (!isValid(control.value)) {
        error = {
          document: {
            name: 'CNPJ',
          },
        };
      }
    }

    return error;

    function isValid(document: string): boolean {
      document = document.replace(/[^\d]+/g, '');
      const cnpj = document;

      if (cnpj === '') { return false; }

      if (cnpj.length !== 14) { return false; }

      // Elimina CNPJs invalidos conhecidos
      if (
        cnpj === '00000000000000' ||
        cnpj === '11111111111111' ||
        cnpj === '22222222222222' ||
        cnpj === '33333333333333' ||
        cnpj === '44444444444444' ||
        cnpj === '55555555555555' ||
        cnpj === '66666666666666' ||
        cnpj === '77777777777777' ||
        cnpj === '88888888888888' ||
        cnpj === '99999999999999'
      ) {
        return false;
      }

      // Valida DVs
      let tamanho = cnpj.length - 2;
      let numeros = cnpj.substring(0, tamanho);
      const digitos = cnpj.substring(tamanho);
      let soma: any = 0;
      let pos: any = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += +numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) { pos = 9; }
      }
      let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado !== +digitos.charAt(0)) { return false; }

      tamanho = tamanho + 1;
      numeros = cnpj.substring(0, tamanho);
      soma = 0;
      pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += +numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) { pos = 9; }
      }
      resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado !== +digitos.charAt(1)) { return false; }

      return true;
    }
  }

  public static cpf_bra(control: AbstractControl): ValidationErrors | null {
    let error = null;

    if (control.valid && control.value) {
      if (!isValid(control.value)) {
        error = {
          document: {
            name: 'CPF',
          },
        };
      }
    }

    return error;

    function isValid(document: string): boolean {
      document = document.replace(/[^\d]+/g, '');

      const strCPF = document;

      if (strCPF === '') { return false; }

      if (strCPF.length !== 11) { return false; }

      if (strCPF === '00000000000') { return false; }

      let Soma;
      let Resto;
      Soma = 0;

      for (let i = 1; i <= 9; i++) {
        // tslint:disable-next-line: radix
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
      }
      Resto = (Soma * 10) % 11;

      if (Resto === 10 || Resto === 11) { Resto = 0; }
      // tslint:disable-next-line: radix
      if (Resto !== parseInt(strCPF.substring(9, 10))) { return false; }

      Soma = 0;
      for (let i = 1; i <= 10; i++) {
        // tslint:disable-next-line: radix
        Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
      }
      Resto = (Soma * 10) % 11;

      if (Resto === 10 || Resto === 11) { Resto = 0; }
      // tslint:disable-next-line: radix
      if (Resto !== parseInt(strCPF.substring(10, 11))) { return false; }

      return true;
    }
  }

  // RUT CHILE
  public static rut_chl(control: AbstractControl): ValidationErrors | null {
    let error = null;

    if (control.valid && control.value) {
      if (!isValid(control.value)) {
        error = {
          document: {
            name: 'RUT',
          },
        };
      }
    }

    return error;

    function isValid(rut: string): boolean {
      if (typeof rut !== 'string') {
        return false;
      }
      // if (!/^0*(\d{1,3}(\.?\d{3})*)-?([\dkK])$/.test(rut)) {
      //  return false;
      // }

      rut = clean(rut);

      let t = parseInt(rut.slice(0, -1), 10);
      let m = 0;
      let s = 1;

      while (t > 0) {
        s = (s + (t % 10) * (9 - (m++ % 6))) % 11;
        t = Math.floor(t / 10);
      }

      const v = s > 0 ? '' + (s - 1) : 'K';
      return v === rut.slice(-1);
    }

    function clean(rut) {
      return typeof rut === 'string'
        ? rut.replace(/^0+|[^0-9kK]+/g, '').toUpperCase()
        : '';
    }
  }

  //// RUC EQUADOR
  public static ruc_ecu(control: AbstractControl): ValidationErrors | null {
    let error = null;

    if (control.valid && control.value) {
      if (!isValid(control.value)) {
        error = {
          document: {
            name: 'RUC',
          },
        };
      }
    }

    return error;

    // Valid RUC for private societies or foreign withoutID

    function isValid(id: string): boolean {
      id = id.replace(/[^\d]+/g, '');
      // console.log('id', id);
      // tslint:disable-next-line: radix
      const region: number = parseInt(id.substring(0, 2));
      // console.log('region', region);
      // tslint:disable-next-line: radix
      const thirdDigit = parseInt(id.substring(2, 3));
      // console.log('thirdDigit', thirdDigit);

      if (region >= 1 && region <= 24 && thirdDigit === 9) {
        const coefficients = [4, 3, 2, 7, 6, 5, 4, 3, 2];

        // tslint:disable-next-line: radix
        const tenthDigit = parseInt(id.substring(9, 10));
        // console.log('tenthDigit', tenthDigit);
        const branch = id.substring(10, 13);
        // console.log('branch', branch);
        let total = 0;

        for (let i = 0; i < 9; i++) {

          // tslint:disable-next-line: radix
          total += parseInt(id.substring(i, i + 1)) * coefficients[i];
        }

        const validatorDigit: number = 11 - (total % 11);

        if (validatorDigit === tenthDigit && branch === '001') {
          return true;
        } else {
          return false;
        }
      }
    }
  }



  //   //// NIT BOLIVIA
  public static   nit_bol(control: AbstractControl): Promise<ValidationErrors | null> {
    let error = null;
    let ret =  isValid(control.value);


    if (control.valid && control.value) {
      if (!ret) {
        error = {
          document: {
            name: 'NIT',
          },
        };
      }
    }

    console.log('error', error);

    return  error;


     function  isValid(nit: string): boolean {

    if (nit != null) {
      nit = nit.replace(/[^\d]+/g, '');


      // let data = await fetch(
      //   'http://pbdw.impuestos.gob.bo:8080/gob.sin.padron.servicio.web/consulta/verificarContribuyente?nit=' + nit
      // );

      // let main = await data.json();

      // console.log(data) ;


      // if (main.ok) {
      //   console.log('retorno true..', main.ok) ;
      //   return true;
      // } else {
      //   console.log('retorno false..', main.ok) ;
      //   return false;
      // }
      return true;
    }
    }
  }



  //   // RUC PERU
  public static ruc_per(control: AbstractControl): ValidationErrors | null {
    let error = null;

    if (control.valid && control.value) {
      if (!isValid(control.value)) {
        error = {
          document: {
            name: 'RUC',
          },
        };
      }
    }

    return error;

    function isValid(ruc: any): boolean {

      ruc = ruc.replace(/[-.,[\]()\s]+/g, '');
      // console.log(ruc);
      let valido = true;

      // tslint:disable-next-line: triple-equals
      if ((ruc == Number(ruc)) && ruc % 1 === 0 && rucValido(ruc)) {
        // console.log('Numeber(ruc)', Number(ruc));
        return valido;

      } else {
        valido = false;
        return valido;
      }

      // Devuelve un booleano si es un RUC válido
      // (deben ser 11 dígitos sin otro caracter en el medio)
      // tslint:disable-next-line: no-shadowed-variable
      function rucValido(ruc: any) {
        // 11 dígitos y empieza en 10,15,16,17 o 20
        if (!(ruc >= 1e10 && ruc < 11e9 || ruc >= 15e9 && ruc < 18e9 || ruc >= 2e10 && ruc < 21e9)) {
          // console.log('ruc>=1e10', ruc >= 1e10);
          return false;
        }



        // tslint:disable-next-line: no-bitwise
        for (var suma = -(ruc % 10 < 2), i = 0; i < 11; i++, ruc = ruc / 10 | 0) {
          // tslint:disable-next-line: no-bitwise
          suma += (ruc % 10) * (i % 7 + (i / 7 | 0) + 1);
        }
        return suma % 11 === 0;

      }
    }


  }


  //    //// RUC PARAGUAY
  public static ruc_pry(control: AbstractControl): ValidationErrors | null {
    let error = null;

    if (control.valid && control.value) {
      if (!isValid(control.value)) {
        error = {
          document: {
            name: 'RUC',
          },
        };
      }
    }

    return error;

    function isValid(ruc: string): boolean {
      ruc = ruc.replace(/[^\d]+/g, '');

      const regexFormat: RegExp = /^(\d|\.|\-)+$/;
      const regexAdjust: RegExp = /\D/gi;
      const baseMod = 11;

      if (!ruc) {
        return false;
      }

      const adjustedRuc = ruc.replace(regexAdjust, '');
      console.log('adjustedRuc', adjustedRuc);

      if (![8, 9].includes(adjustedRuc.length)) {
        return false;
      }

      const identityDigitsLength: number = adjustedRuc.length - 2;
      console.log('identityDigitsLength', identityDigitsLength);

      let valueSum = 0;
      let increasingSequenceQtd = 0;
      let decreasingSequenceQtd = 0;
      let equalsDigitQtd = 0;

      for (let index = identityDigitsLength, multiplier = 2; index >= 0; index -= 1, multiplier += 1) {
        valueSum += Number(adjustedRuc[index]) * multiplier;

        if (index > 0) {
          const previousDigit = Number(adjustedRuc[index - 1]);
          const currentDigit = Number(adjustedRuc[index]);
          if (previousDigit === currentDigit) {
            equalsDigitQtd += 1;
          }

          if (currentDigit > previousDigit) {
            increasingSequenceQtd += 1;
          }

          if (previousDigit > currentDigit) {
            decreasingSequenceQtd += 1;
          }
        }
      }

      if (increasingSequenceQtd >= 6 || decreasingSequenceQtd >= 6 || equalsDigitQtd >= 6) {
        return false;
      }

      const mod = valueSum % baseMod;
      const verifyDigit = mod > 1 ? baseMod - mod : 0;
      console.log('adjustedRuc[identityDigitsLength + 1]', adjustedRuc[identityDigitsLength + 1]);
      console.log('verifyDigit.toString()', verifyDigit.toString());
      return adjustedRuc[identityDigitsLength + 1] === verifyDigit.toString();

    }

  }


  //  ////  CUIT ARGENTINA
  public static cuit_arg(control: AbstractControl): ValidationErrors | null {
    let error = null;

    if (control.valid && control.value) {
      if (!isValid(control.value)) {
        error = {
          document: {
            name: 'CUIT',
          },
        };
      }
    }

    return error;

    function isValid(sCUIT: any): boolean {

      sCUIT = sCUIT.replace(/[-.,[\]()\s]+/g, '');

      // console.log('SCUIT:', sCUIT) ;
      const aMult = '5432765432';
      let aMultArr: any[];
      aMultArr = aMult.split('');

      if (sCUIT && sCUIT.length === 11) {
        const aCUIT = sCUIT.split('');
        // console.log('aCUIT:', aCUIT) ;
        let iResult = 0;
        for (let i = 0; i <= 9; i++) {
          iResult += aCUIT[i] * aMultArr[i];
        }

        iResult = (iResult % 11);
        // console.log('iResult%11:', iResult) ;
        iResult = 11 - iResult;
        // console.log('iResult_if:', iResult) ;
        if (iResult === 11) { iResult = 0; }

        if (iResult === 10) { iResult = 9; }
        // console.log('iResult:', iResult) ;
        // console.log('aCUIT[10]:', aCUIT[10]) ;
        if (iResult === Number(aCUIT[10])) {
          return true;
        }
      }
      return false;

    }
  }
  // //// NIT COLOMBIA
  public static nit_col(control: AbstractControl): ValidationErrors | null {
    let error = null;

    if (control.valid && control.value) {
      if (!IsValidNit(control.value)) {
        error = {
          document: {
            name: 'NIT',
          },
        };
      }
    }

    return error;

    function IsValidNit(nit: string): boolean {
      nit = nit.replace(/[^\d]+/g, '');
      // console.log('NIT:', nit) ;
      if (nit.length !== 10) { return false; }

      if (nit === '') { return false; }

      const digitos = [];

      for (let i = 0; i < nit.length; i++) {
        digitos[i] = nit[i];
      }

      let v =
        41 * digitos[0] +
        37 * digitos[1] +
        29 * digitos[2] +
        23 * digitos[3] +
        19 * digitos[4] +
        17 * digitos[5] +
        13 * digitos[6] +
        7 * digitos[7] +
        3 * digitos[8];
      v = v % 11;
      // console.log('V:', v) ;
      if (v >= 2) { v = 11 - v; }
      return v === Number(digitos[9]);
    }
  }

  //  //// RUT URUGUAY

  public static rut_ury(control: AbstractControl): ValidationErrors | null {
    let error = null;

    if (control.valid && control.value) {
      if (!IsValidRut(control.value)) {
        error = {
          document: {
            name: 'RUT',
          },
        };
      }
    }

    return error;

    function IsValidRut(doc: string): boolean {
      doc = doc.replace(/[^\d]+/g, '');
      // console.log('doc', doc) ;
      if (doc.length !== 12) {
        return false;
      }

      // tslint:disable-next-line: radix
      const dc = parseInt(doc.substr(11, 1));
      const rut = doc.substr(0, 11);
      let total = 0;
      let factor = 2;

      for (let i = 10; i >= 0; i--) {
        // tslint:disable-next-line: radix
        total += factor * parseInt(rut.substr(i, 1));
        factor = factor === 9 ? 2 : ++factor;
      }

      let dv = 11 - (total % 11);

      if (dv === 11) {
        dv = 0;
      } else if (dv === 10) {
        dv = 1;
      }
      if (dv === dc) {
        return true;
      }
      return false;
    }
  }



  public static ein_usa(control: AbstractControl): ValidationErrors | null {
    let error = null;

    if (control.valid && control.value) {
      if (!EinValidator.isValid(control.value)) {
        error = {
          document: {
            name: 'EIN',
          },
        };
      }
    }

    return error;
  }

  public static itin_usa(control: AbstractControl): ValidationErrors | null {
    let error = null;

    if (control.valid && control.value) {
      if (!ItinValidator.isValid(control.value)) {
        error = {
          document: {
            name: 'ITIN',
          },
        };
      }
    }

    return error;
  }

  public static ssn_usa(control: AbstractControl): ValidationErrors | null {
    let error = null;

    if (control.valid && control.value) {
      if (!SsnValidator.isValid(control.value)) {
        error = {
          document: {
            name: 'SSN',
          },
        };
      }
    }

    return error;
  }

}
// end of class

   // function sleep(milliseconds) {
    //   var start = new Date().getTime();
    //   for (var i = 0; i < 1e7; i++) {
    //     if ((new Date().getTime() - start) > milliseconds){
    //       break;
    //     }
    //   }
    // }
