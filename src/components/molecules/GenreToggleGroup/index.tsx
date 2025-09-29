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
          <span>{genre}</span>
        </Button>
      ))}
    </div>
  )
}

export default GenreToggleGroup