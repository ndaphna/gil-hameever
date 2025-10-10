export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto p-8">
      <h1>התחברות</h1>
      <p className="mb-6">
        לצורכי הדגמה בלבד: שלחי את הטופס כדי להגדיר עוגייה ולקבל גישה לאיזור החברות.
      </p>
      <form action="/api/login" method="post" className="space-y-4">
        <button
          type="submit"
          className="btn btn-primary"
        >
          המשיכי כחברת פרימיום
        </button>
      </form>
    </main>
  );
}


