
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ExtractedCFDIData, Usuario, Factura, EstadoFactura } from '../types';
import Icon from '../../../common/icons/Icon';
import { Button } from './common/Button';

interface FacturaUploaderProps {
  onUploadSuccess: (newFactura: Omit<Factura, 'id' | 'proveedorId'>) => void;
  currentUser: Usuario;
}

const parseCFDI = (xmlString: string): Promise<ExtractedCFDIData> => {
  return new Promise((resolve, reject) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        return reject(new Error('El archivo XML no es válido o está malformado.'));
      }
      
      const comprobante = xmlDoc.getElementsByTagName('cfdi:Comprobante')[0];
      const emisor = comprobante.getElementsByTagName('cfdi:Emisor')[0];
      const timbre = xmlDoc.getElementsByTagName('tfd:TimbreFiscalDigital')[0];

      if (!comprobante || !emisor || !timbre) {
        return reject(new Error('El XML no contiene los nodos CFDI requeridos.'));
      }

      const data: ExtractedCFDIData = {
        razonSocial: emisor.getAttribute('Nombre') || 'N/A',
        rfc: emisor.getAttribute('Rfc') || 'N/A',
        monto: parseFloat(comprobante.getAttribute('Total') || '0'),
        folioFiscal: timbre.getAttribute('UUID') || 'N/A',
      };

      if (!data.razonSocial || !data.rfc || !data.monto || !data.folioFiscal) {
          return reject(new Error('No se pudieron extraer todos los datos necesarios del XML.'));
      }

      resolve(data);
    } catch (error) {
      reject(new Error('Ocurrió un error al procesar el archivo XML.'));
    }
  });
};


export const FacturaUploader: React.FC<FacturaUploaderProps> = ({ onUploadSuccess, currentUser }) => {
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedCFDIData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setError(null);
    setExtractedData(null);
    setIsValidated(false);
    
    const xml = acceptedFiles.find(f => f.name.toLowerCase().endsWith('.xml'));
    const pdf = acceptedFiles.find(f => f.name.toLowerCase().endsWith('.pdf'));

    if (xml) {
      setXmlFile(xml);
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const xmlContent = e.target?.result as string;
          const data = await parseCFDI(xmlContent);
          setExtractedData(data);
          
          if (data.rfc !== currentUser.rfc) {
            setError(`El RFC del archivo (${data.rfc}) no coincide con tu registro (${currentUser.rfc}). Por favor, verifica el archivo.`);
            setIsValidated(false);
          } else {
            setIsValidated(true);
          }
        } catch (err: any) {
          setError(err.message);
          setIsValidated(false);
        }
      };
      reader.readAsText(xml);
    }

    if(pdf) {
        setPdfFile(pdf);
    }

  }, [currentUser.rfc]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/xml': ['.xml'], 'application/pdf': ['.pdf'] },
    maxFiles: 2
  });
  
  const handleSubmit = () => {
    if (isValidated && extractedData && xmlFile && pdfFile) {
        const newFactura: Omit<Factura, 'id' | 'proveedorId'> = {
            folioFiscal: extractedData.folioFiscal,
            monto: extractedData.monto,
            fechaCarga: new Date().toISOString(),
            estadoActual: EstadoFactura.RECEPCION,
            historial: [{etapa: EstadoFactura.RECEPCION, fecha: new Date().toISOString(), usuario: 'Sistema'}],
            razonSocial: extractedData.razonSocial,
            rfc: extractedData.rfc,
            xmlFile: xmlFile,
            pdfFile: pdfFile,
        }
        onUploadSuccess(newFactura);
    }
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-300 ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <Icon.Upload className="w-12 h-12 text-gray-400" />
          <p className="mt-2 text-gray-600">
            {isDragActive ? 'Suelta los archivos aquí...' : 'Arrastra y suelta tus archivos XML y PDF, o haz clic para seleccionar.'}
          </p>
          <p className="text-sm text-gray-500">Solo se aceptan archivos .xml y .pdf</p>
        </div>
      </div>

      {(xmlFile || pdfFile) && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {xmlFile && <div className="text-sm text-gray-700 p-2 border rounded-md bg-gray-50">Archivo XML: {xmlFile.name}</div>}
            {pdfFile && <div className="text-sm text-gray-700 p-2 border rounded-md bg-gray-50">Archivo PDF: {pdfFile.name}</div>}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 flex items-center bg-red-100 text-red-700 rounded-md">
            <Icon.XCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
        </div>
      )}

      {extractedData && (
        <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                Datos Extraídos del XML
                {isValidated ? 
                    <CheckCircleIcon className="w-6 h-6 ml-2 text-green-500" /> :
                    <XCircleIcon className="w-6 h-6 ml-2 text-red-500" />
                }
            </h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-100 p-3 rounded-md">
                    <label className="block text-gray-500">Razón Social</label>
                    <p className="font-semibold text-gray-900">{extractedData.razonSocial}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-md">
                    <label className="block text-gray-500">RFC</label>
                    <p className="font-semibold text-gray-900">{extractedData.rfc}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-md">
                    <label className="block text-gray-500">Monto Total</label>
                    <p className="font-semibold text-gray-900">{new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(extractedData.monto)}</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-md">
                    <label className="block text-gray-500">Folio Fiscal (UUID)</label>
                    <p className="font-semibold text-gray-900">{extractedData.folioFiscal}</p>
                </div>
            </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleSubmit} 
            disabled={!isValidated || !pdfFile}
            variant="success"
          >
            Continuar con la Carga
          </Button>
      </div>

    </div>
  );
};
