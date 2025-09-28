// Helper function for units
const Unidades = (num: number): string => {
    switch (num) {
        case 1: return 'UNO';
        case 2: return 'DOS';
        case 3: return 'TRES';
        case 4: return 'CUATRO';
        case 5: return 'CINCO';
        case 6: return 'SEIS';
        case 7: return 'SIETE';
        case 8: return 'OCHO';
        case 9: return 'NUEVE';
        default: return '';
    }
};

// Helper function for tens
const Decenas = (num: number): string => {
    const decena = Math.floor(num / 10);
    const unidad = num % 10;

    if (num < 10) return Unidades(num);
    if (num < 16) {
        return {
            10: 'DIEZ', 11: 'ONCE', 12: 'DOCE', 13: 'TRECE', 14: 'CATORCE', 15: 'QUINCE'
        }[num]!;
    }
    if (num < 20) return 'DIECI' + Unidades(unidad).toLowerCase();
    if (num < 30) {
        if (num === 20) return 'VEINTE';
        // Special cases for accents
        if (num === 21) return 'VEINTIUNO';
        if (num === 22) return 'VEINTIDÓS';
        if (num === 23) return 'VEINTITRÉS';
        if (num === 26) return 'VEINTISÉIS';
        return 'VEINTI' + Unidades(unidad).toLowerCase();
    }

    const baseDecena = {
        3: 'TREINTA', 4: 'CUARENTA', 5: 'CINCUENTA', 6: 'SESENTA', 7: 'SETENTA', 8: 'OCHENTA', 9: 'NOVENTA'
    }[decena]!;

    return unidad === 0 ? baseDecena : `${baseDecena} Y ${Unidades(unidad)}`;
};

// Helper function for hundreds
const Centenas = (num: number): string => {
    if (num > 999 || num < 100) return Decenas(num);
    const centena = Math.floor(num / 100);
    const resto = num % 100;
    
    if (num === 100) return 'CIEN';
    
    const baseCentena = {
        1: 'CIENTO', 2: 'DOSCIENTOS', 3: 'TRESCIENTOS', 4: 'CUATROCIENTOS', 5: 'QUINIENTOS', 6: 'SEISCIENTOS', 7: 'SETECIENTOS', 8: 'OCHOCIENTOS', 9: 'NOVECIENTOS'
    }[centena]!;

    const restoEnLetras = Decenas(resto);
    return resto === 0 ? baseCentena : `${baseCentena} ${restoEnLetras}`;
};

// Main conversion function
export const convertNumberToWords = (numStr: string | number): string => {
    const num = Number(numStr);

    if (isNaN(num) || num === null || num < 0) return '';
    if (num === 0) return 'CERO';

    const parteEntera = Math.floor(num);

    const Millones = (n: number): string => {
        if (n < 1000000) return Miles(n);
        const millon = Math.floor(n / 1000000);
        const resto = n % 1000000;
        const strMillon = millon === 1 ? 'UN MILLON' : `${Miles(millon)} MILLONES`;
        const strResto = Miles(resto);
        return resto === 0 ? strMillon : `${strMillon} ${strResto}`;
    };
    
    const Miles = (n: number): string => {
        if (n < 1000) return Centenas(n);
        const mil = Math.floor(n / 1000);
        const resto = n % 1000;
        const strMil = mil === 1 ? 'MIL' : `${Centenas(mil)} MIL`;
        const strResto = Centenas(resto);
        return resto === 0 ? strMil : `${strMil} ${strResto}`;
    };

    let result = Millones(parteEntera);
    return result.replace(/\s+/g, ' ').trim();
};