// src/common/icons/Icon.tsx
import {
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ArchiveBoxXMarkIcon,
  DocumentPlusIcon,
  LinkIcon,
  // Asegúrate de incluir aquí todos los iconos que necesites (ej. Dashboard, Contracts, Bell...)
} from "@heroicons/react/24/outline";

// Creamos un objeto Icon centralizado (como esperaban los módulos)
const Icon = {
  Check: CheckIcon,
  Close: XMarkIcon,
  Clock: ClockIcon,
  Dollar: CurrencyDollarIcon,
  Warning: ExclamationTriangleIcon,
  Archive: ArchiveBoxXMarkIcon,
  Document: DocumentPlusIcon,
  Link: LinkIcon,
  // Añade aquí más aliases si FacturaDetailView.tsx o Penalizaciones los usa (ej. Icon.X)
  X: XMarkIcon, // Para FacturaDetailView, etc.
};

// **CORRECCIÓN CRÍTICA:** Exportamos por defecto para satisfacer a casi todos los consumidores.
export default Icon;

// Opcional: También exportamos los componentes individuales para casos especiales
// export { CheckIcon, XMarkIcon, ClockIcon };