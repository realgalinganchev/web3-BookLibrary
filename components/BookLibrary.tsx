import type { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import useBookLibraryContract from "../hooks/useBookLibraryContract";
import Loader from "./Loader";

type USContract = {
  contractAddress: string;
};

const BookLibrary = ({ contractAddress }: USContract) => {
  const { account, library } = useWeb3React<Web3Provider>();
  const bookLibraryContract = useBookLibraryContract(contractAddress);
  const [isLoading, setIsLoading] = useState<boolean | undefined>(false);
  const [txHash, setTxHash] = useState<string | undefined>("");
  const [newBookName, setNewBookName] = useState<string | undefined>();
  const [newBookCopiesCount, setNewBookCopiesCount] = useState<number | undefined>();
  const [existingBookName, setExistingBookName] = useState<string | undefined>();
  const [existingBookCopiesCount, setExistingBookCopiesCount] = useState<number | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>('');

  const [books, setBooks] = useState<any[] | undefined>([]);
  const [myBooks, setMyBooks] = useState<any[] | undefined>([]);

  useEffect(() => {
    getBooks();
  })

  const getBooks = async () => {
    const allBooks = await bookLibraryContract.getAllBooksInLibrary()
    //const availableBooks = allBooks.filter(book => parseInt(book.copiesCount) != 0);
    const formattedBooks = allBooks.map(nested => nested.map(element => element.toString()))
    setBooks(formattedBooks)
  }

  const newBookNameInput = (input) => {
    setNewBookName(input.target.value)
  }

  const newBookCopiesCountInput = (input) => {
    setNewBookCopiesCount(input.target.value)
  }

  const existingBookNameInput = (input) => {
    setExistingBookName(input.target.value)
  }

  const existingBookCopiesCountInput = (input) => {
    setExistingBookCopiesCount(input.target.value)
  }

  const displayErrorReason = (err) => {
    if (err.error) {
      setErrorMessage(err.error.message.slice(20));
      setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    }
  }

  const addNewBookAndCopiesCount = async () => {
    try {
      const tx = await bookLibraryContract.addNewBookAndCopiesCount(newBookName, newBookCopiesCount);
      setIsLoading(true);
      setTxHash(tx.hash);
      await tx.wait();
      newBookResetForm();
      setIsLoading(false);
    } catch (err) {
      displayErrorReason(err)
    }
  }

  const addCopiesToExistingBook = async () => {
    try {
      const tx = await bookLibraryContract.addCopiesToExistingBook(existingBookName, existingBookCopiesCount);
      setIsLoading(true);
      setTxHash(tx.hash);
      await tx.wait();
      existingBookResetForm();
      setIsLoading(false);
    } catch (err) {
      displayErrorReason(err)
    }
  }

  const newBookResetForm = async () => {
    setNewBookName('');
    setNewBookCopiesCount(0);
  }

  const existingBookResetForm = async () => {
    setExistingBookName('');
    setExistingBookCopiesCount(0);
  }

  const getId = async (title) => {
    let id = 0
    await bookLibraryContract.generateIdFromTitle(title).then( data =>{
      id = data
    })
    
    return id
  }


  const borrowBook = async (book) => {
    try {
      const tx = await bookLibraryContract.borrowBook(getId(book[0]));
      setIsLoading(true);
      setTxHash(tx.hash);
      await tx.wait();
      setIsLoading(false);
      setMyBooks(myBooks => [...myBooks, book])
    } catch (err) {
      displayErrorReason(err)
    }
  }
  const returnBook = async (book) => {
    try {
      const tx = await bookLibraryContract.returnBook(getId(book[0]));

      setIsLoading(true);
      setTxHash(tx.hash);
      await tx.wait();
      setIsLoading(false);
      let filteredBooks = myBooks.filter(myBook => myBook[0] !== book[0])
      setMyBooks(filteredBooks)
    } catch (err) {
      displayErrorReason(err)
    }
  }


  return (
    <div className="results-form">
      <p>
        ADD A NEW BOOK TO THE LIBRARY
      </p>
      <form>
        <label>
          Name of the new book:
          <input onChange={newBookNameInput} value={newBookName} type="text" name="new_book_name" />
        </label>
        <label>
          Number of copies:
          <input onChange={newBookCopiesCountInput} value={newBookCopiesCount} type="number" name="new_book_name_copies_count" />
        </label>
      </form>
      <div className="button-wrapper">
        <button onClick={addNewBookAndCopiesCount}>Add new book</button>
      </div>
      <p>
        ADD COPIES TO AN EXISTING BOOK TO THE LIBRARY
      </p>
      <form>
        <label>
          Name of the existing book:
          <input onChange={existingBookNameInput} value={existingBookName} type="text" name="existing_book_name" />
        </label>
        <label>
          Number of new copies:
          <input onChange={existingBookCopiesCountInput} value={existingBookCopiesCount} type="number" name="existing_book_copies_count" />
        </label>
      </form>
      <div className="button-wrapper">
        <button onClick={addCopiesToExistingBook}>Add new copies</button>
      </div>
      {
        errorMessage && <div className="error-message">
          {errorMessage}
        </div>
      }
      {isLoading ?
        <Loader txHash={txHash} />
        :
        <div className="library">
          Library:
          <ol>
            {books.map(book => (
              <li key={book}>
                {book}
                <button onClick={() => borrowBook(book)}>Rent me</button>
              </li>
            ))}
          </ol>
        </div>
      }
      <div className="my_books">
        My currently borrowed books:
        <ol>
          {myBooks.map(book => (
            <li key={book}>
              {book[0]}
              <button onClick={() => returnBook(book)}>Return me</button>
            </li>
          ))}
        </ol>
      </div>

      <style jsx>{`
        .results-form {
          display: flex;
          flex-direction: column;
        }

        .button-wrapper {
          margin: 20px;
        }

        .error-message{
          border: 1px solid;
          margin: 10px auto;
          padding: 15px 10px;
          background-repeat: no-repeat;
          background-position: 10px center;
          max-width: 460px;
          color: #D8000C;
	        background-color: #FFBABA;
        }

        .library{
          background: aliceblue;
          padding: 10px;
          width: 50vw;
          margin: 0 auto;
        }

        .my_books{
          background: beige;
          padding: 10px;
          width: 50vw;
          margin: 35px auto;
        }
        
        form {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </div>
  );
};

export default BookLibrary;
