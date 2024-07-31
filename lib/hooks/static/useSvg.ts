import { useError } from "../mdd";

export async function useSvg({ name }: IUseSvg) {
  const { useFatalError } = useError();

  try {
    return (await import(`/icons/${name.toLowerCase()}.svg`)).default;
  } catch (error: any) {
    useFatalError(`Cannot load SVG '${name}': ${error}`);
  }
}

interface IUseSvg {
  name: string;
}