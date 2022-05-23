import BOOK_LIBRARY_ABI from "../contracts/BookLibrary.json";
import type { BookLibrary } from "../contracts/types";
import useContract from "./useContract";

export default function useBookLibraryContract(contractAddress?: string) {
  return useContract<BookLibrary>(contractAddress, BOOK_LIBRARY_ABI);
}
