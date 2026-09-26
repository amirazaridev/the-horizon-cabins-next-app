import { useState } from "react";
import { deleteCabinAction } from "../lib/cabin-actions";
import toast from "react-hot-toast";

export default function useDeleteCabin(cabinId: number) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function handleConfirm() {
    const result = await deleteCabinAction(cabinId);
    if (!result.success) {
      toast.error(result.message);
      throw new Error(result.message);
    }
    toast.success(result.message);
  }

  return { handleConfirm, isModalOpen, setIsModalOpen };
}
