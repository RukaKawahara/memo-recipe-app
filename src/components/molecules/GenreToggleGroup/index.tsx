import React from 'react'
import Button from '@/components/atoms/Button'
import styles from './GenreToggleGroup.module.scss'

interface GenreToggleGroupProps {
  genres: string[]
  selectedGenres: string[]
  onGenreToggle: (genre: string) => void
  className?: string
}

const GenreToggleGroup: React.FC<GenreToggleGroupProps> = ({
  genres,
  selectedGenres,
  onGenreToggle,
  className
}) => {
  return (
    <div className={`${styles.genreGrid} ${className || ''}`}>
      {genres.map((genre) => (
        <Button
          key={genre}
          type="button"
          variant="genre"
          selected={selectedGenres.includes(genre)}
          onClick={() => onGenreToggle(genre)}
        >
          <div className={styles.checkbox}>
            {selectedGenres.includes(genre) && (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
              </svg>
            )}
          </div>
          <span>{genre}</span>
        </Button>
      ))}
    </div>
  )
}

export default GenreToggleGroup