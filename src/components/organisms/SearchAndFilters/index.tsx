import SearchBox from '@/components/molecules/SearchBox'
import GenreSelector from '@/components/molecules/GenreSelector'
import styles from './SearchAndFilters.module.scss'

export interface SearchAndFiltersProps {
  searchTerm: string
  selectedGenre: string
  genres: string[]
  onSearchChange: (value: string) => void
  onGenreChange: (value: string) => void
  className?: string
}

export const SearchAndFilters = ({
  searchTerm,
  selectedGenre,
  genres,
  onSearchChange,
  onGenreChange,
  className = ''
}: SearchAndFiltersProps) => {
  const genreOptions = genres.map((genre) => ({
    value: genre,
    label: genre
  }))

  return (
    <div className={`${styles.searchAndFilters} ${className}`.trim()}>
      <SearchBox
        placeholder="レシピを検索"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className={styles.searchBox}
      />
      <GenreSelector
        options={genreOptions}
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
        className={styles.genreSelector}
      />
    </div>
  )
}

export default SearchAndFilters