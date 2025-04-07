import { type FC } from 'react';

const App: FC = () => {
  return (
    <>
      <header>
        <div className="title-container">
          <h2>Katavault</h2>
          <h3>React Example</h3>
        </div>
      </header>

      <main>
        <div className="actions-container">
          <button>Create Account</button>
          <button>Reset</button>
        </div>

        <div className="accounts-table-container"></div>
      </main>
    </>
  );
};

export default App;
