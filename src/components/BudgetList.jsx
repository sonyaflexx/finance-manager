export default function BudgetList({ plans }) {
    return (
        <div className="p-6 bg-white shadow-md rounded-xl mt-6">
          <h2 className="text-2xl font-semibold mb-4">Планы расходов по категориям</h2>
          <ul className="h-56 overflow-y-auto flex flex-col gap-1">
            { plans && plans.length > 0 ? (
              plans.map(plan => (
                <li key={plan.id} className="w-full flex justify-between px-4 py-2 border rounded-xl items-center">
                  <div className='font-medium'>{plan.category}</div>
                  <div className={`font-medium ${plan.value > plan.goal && 't text-red-600'}`}>{plan.value}₽ / {plan.goal}₽</div>
                </li>
            ))) : (
              <div className='mx-auto'>Планов не найдено.</div>
            )}
          </ul>
        </div>
    )
}