const Input = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <input
        className={`w-full rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition ${className}`}
        {...props}
      />

      {error && (
        <p className="text-xs text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
