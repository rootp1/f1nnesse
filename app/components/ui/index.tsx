// For simple functional components
export const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="border rounded-lg p-4">{children}</div>
);

export const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4">{children}</div>
);

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className="border rounded p-2" />
);

export const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className="bg-blue-500 text-white px-4 py-2 rounded" />
);