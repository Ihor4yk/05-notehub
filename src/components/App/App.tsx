import { useState } from "react"
import NoteList from "../NoteList/NoteList"
import css from "./App.module.css"
import Modal from "../Modal/Modal";
import { fetchNotes } from "../../services/noteService";
import { keepPreviousData, useQuery, } from "@tanstack/react-query";
import SearchBox from "../SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "../Pagination/Pagination";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import NoteForm from "../NoteForm/NoteForm";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;

  const { data, isSuccess, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["notes", searchValue, currentPage],
    queryFn: () => fetchNotes(searchValue, currentPage, perPage),
    enabled: true,
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;

  const handleSearch = useDebouncedCallback((val: string) => {
    setSearchValue(val);
    setCurrentPage(1);
  }, 500);

  const openModalForm = () => {
    setIsModalOpen(true);
  }

  const closeModalForm = () => {
    setIsModalOpen(false);
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchValue} onSearch={handleSearch} />
        {isSuccess && totalPages > 1 && (<Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />)}
        <button className={css.button} onClick={openModalForm}>Create note +</button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage message={(error as Error).message} />}
      {isFetching && <p className={css.fetching}>Refreshing notes...</p>}
      {isSuccess && data.notes.length > 0 && (<NoteList notes={data.notes} />)}
      {isModalOpen && (
        <Modal onClose={closeModalForm}>
          <NoteForm onSuccess={closeModalForm} />
        </Modal>
      )}
    </div>
  )
}