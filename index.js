// const Expenses = [];

// function Addexpenses(amount,cat) {
//  Expenses.push({amount:amount,category:cat});
// }

// Addexpenses(500,'food');
// Addexpenses(200,'travel');
// Addexpenses(100,'utilities');
// Addexpenses(3000,'Petrol')

// let total=0;

// for(let i=0;i<Expenses.length;i++){
//   total+=Expenses[i].amount;
// }


// console.log('Expenses:', Expenses);
// console.log('Total:', total );
// console.log("Total items: ", Expenses.length);


const programmes = [
{item:'dance', points:30},
{item:'mono-act', points:40},
{item:'song', points:30},
{item:'drama', points:50},
{item:'song', points:60},
]

const tpoints=programmes
.filter(por=>por.item==='song')
.reduce((sum,por)=>{
return sum+por.points;
}, 0);
  
console.log(tpoints);