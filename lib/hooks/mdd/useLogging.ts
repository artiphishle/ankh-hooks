import { uuid } from "uuidv4";

function consoleLog({ message }: IAnkhLoggingEntryCreate) {
  const createdOn = new Date().getTime();
  console.log(createdOn, message);
}

export function useAnkhLogging(api: IUseAnkhLogging = { create: consoleLog }) {

  function writeLog(message: string) {
    const id = uuid();
    const createdOn = new Date().getTime();

    const logEntry: IAnkhLoggingEntry = {
      id, createdOn, message
    };
    api.create(logEntry);
  }

  return { writeLog }
}

type TUniqueIdentifier = string;

interface IAnkhLoggingEntryCreate extends Omit<IAnkhLoggingEntry, 'id'> { }
interface IAnkhLoggingEntry {
  id: TUniqueIdentifier,
  message: string;
  createdOn: EpochTimeStamp;
}
interface IAnkhApiCrud {
  create: (logEntry: IAnkhLoggingEntryCreate) => void;
  read: (id: TUniqueIdentifier) => void;
  update: (id: TUniqueIdentifier, data: any) => void;
  delete: (id: TUniqueIdentifier) => void;
}
interface IUseAnkhLogging {
  create: IAnkhApiCrud['create']
}