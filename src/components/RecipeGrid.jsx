import RecipeCard from './RecipeCard.jsx'

// Lays out a responsive grid of RecipeCards. Alternates the tape side so the
// board looks hand-arranged rather than mechanical.
export default function RecipeGrid({ meals, onOpen }) {
  return (
    <div className="recipe-grid">
      {meals.map((meal, i) => (
        <RecipeCard
          key={meal.idMeal}
          meal={meal}
          onOpen={onOpen}
          tapeSide={i % 2 === 0 ? 'left' : 'right'}
        />
      ))}
    </div>
  )
}
