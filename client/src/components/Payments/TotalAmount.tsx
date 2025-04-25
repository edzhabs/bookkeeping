const TotalAmount = ({ totalAmount }: { totalAmount: number }) => {
  return (
    <div className="bg-slate-100 p-4 rounded-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Total Amount:</h3>
        <div className="text-2xl font-bold">₱{totalAmount.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default TotalAmount;
