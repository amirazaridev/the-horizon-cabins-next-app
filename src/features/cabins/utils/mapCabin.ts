import { Cabin, CabinDto } from "../types/cabin.types";

export function mapCabin(dto: CabinDto): Cabin {
  return {
    ...dto,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}