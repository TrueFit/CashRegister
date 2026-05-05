import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

afterEach(() => {
  vi.restoreAllMocks();
});

function renderApp(initialEntries: string[] = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <App />
    </MemoryRouter>,
  );
}

describe('App', () => {
  it('calculates change from the transaction form', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.clear(screen.getByLabelText('Amount Owed'));
    await user.type(screen.getByLabelText('Amount Owed'), '2.12');
    await user.clear(screen.getByLabelText('Amount Paid'));
    await user.type(screen.getByLabelText('Amount Paid'), '3.00');
    await user.click(screen.getByRole('button', { name: /calculate change/i }));

    expect(screen.getAllByText('$0.88').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('quarters');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('dime');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('pennies');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('Total');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('$0.75');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('$0.10');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('$0.03');
  });

  it('shows validation errors', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.clear(screen.getByLabelText('Amount Owed'));
    await user.type(screen.getByLabelText('Amount Owed'), '4.00');
    await user.clear(screen.getByLabelText('Amount Paid'));
    await user.type(screen.getByLabelText('Amount Paid'), '3.00');
    await user.click(screen.getByRole('button', { name: /calculate change/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Line 1: amount paid is less than amount owed',
    );
  });

  it('generates a valid random sample transaction', async () => {
    const user = userEvent.setup();
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.456)
      .mockReturnValueOnce(0.75);
    renderApp();

    await user.click(screen.getByRole('button', { name: /sample/i }));

    expect(screen.getByLabelText('Amount Owed')).toHaveValue('5.10');
    expect(screen.getByLabelText('Amount Paid')).toHaveValue('9.00');
    expect(screen.getAllByText('$3.90').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /download sample input/i })).toHaveAttribute(
      'download',
      'sample-input.txt',
    );
  });

  it('regenerates a random transaction from the history badge', async () => {
    const user = userEvent.setup();
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    renderApp();

    await user.type(screen.getByLabelText('Amount Owed'), '3.33');
    await user.type(screen.getByLabelText('Amount Paid'), '5.00');
    await user.click(screen.getByRole('button', { name: /calculate change/i }));

    expect(screen.getByText('167 pennies')).toBeInTheDocument();

    vi.mocked(Math.random).mockReturnValue(0);
    await user.click(screen.getByRole('button', { name: /^random$/i }));

    expect(screen.getByText('1 dollar bill,2 quarters,1 dime,1 nickel,2 pennies')).toBeInTheDocument();
  });

  it('regenerates the main change breakdown from the random denominations badge', async () => {
    const user = userEvent.setup();
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    renderApp();

    await user.type(screen.getByLabelText('Amount Owed'), '3.33');
    await user.type(screen.getByLabelText('Amount Paid'), '5.00');
    await user.click(screen.getByRole('button', { name: /calculate change/i }));

    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('pennies');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('167');

    vi.mocked(Math.random).mockReturnValue(0);
    await user.click(screen.getByRole('button', { name: /random denominations/i }));

    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('dollar bill');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('quarters');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('dime');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('nickel');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('pennies');
  });

  it('stores transactions in local storage and shows them on the history page', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByLabelText('Amount Owed'), '2.12');
    await user.type(screen.getByLabelText('Amount Paid'), '3.00');
    await user.click(screen.getByRole('button', { name: /calculate change/i }));

    await waitFor(() => {
      const rawHistory = localStorage.getItem('cash-register:transaction-history');
      expect(rawHistory).not.toBeNull();
      expect(JSON.parse(rawHistory ?? '[]')).toHaveLength(1);
    });

    await user.click(screen.getByRole('link', { name: /^history$/i }));

    expect(screen.getByRole('heading', { name: /transaction history/i })).toBeInTheDocument();
    expect(screen.getByLabelText('All transactions')).toHaveTextContent('$2.12');
    expect(screen.getByLabelText('All transactions')).toHaveTextContent('$3.00');
    expect(screen.getByLabelText('All transactions')).toHaveTextContent('3 quarters,1 dime,3 pennies');
  });

  it('shows a recent transaction detail in the change panel when View is clicked', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByLabelText('Amount Owed'), '2.12');
    await user.type(screen.getByLabelText('Amount Paid'), '3.00');
    await user.click(screen.getByRole('button', { name: /calculate change/i }));

    await user.clear(screen.getByLabelText('Amount Owed'));
    await user.type(screen.getByLabelText('Amount Owed'), '1.00');
    await user.clear(screen.getByLabelText('Amount Paid'));
    await user.type(screen.getByLabelText('Amount Paid'), '2.00');
    await user.click(screen.getByRole('button', { name: /calculate change/i }));

    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('dollar bill');

    await user.click(screen.getAllByRole('button', { name: /^view$/i })[1]);

    expect(screen.getByLabelText('Amount Owed')).toHaveValue('2.12');
    expect(screen.getByLabelText('Amount Paid')).toHaveValue('3.00');
    expect(screen.getAllByText('$0.88').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('quarters');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('dime');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('pennies');
  });

  it('uses the settings trick number for the twist rule', async () => {
    const user = userEvent.setup();
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    renderApp();

    await user.click(screen.getByRole('link', { name: /^settings$/i }));
    await user.clear(screen.getByLabelText('Trick Number'));
    await user.type(screen.getByLabelText('Trick Number'), '4');
    await user.click(screen.getByRole('button', { name: /save settings/i }));

    expect(screen.getByText('Settings saved.')).toBeInTheDocument();
    expect(localStorage.getItem('cash-register:trick-number')).toBe('4');

    await user.click(screen.getByRole('link', { name: /^calculator$/i }));
    await user.type(screen.getByLabelText('Amount Owed'), '2.12');
    await user.type(screen.getByLabelText('Amount Paid'), '3.00');
    await user.click(screen.getByRole('button', { name: /calculate change/i }));

    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('pennies');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('88');
  });

  it('resets software state and clears local storage from settings', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByLabelText('Amount Owed'), '2.12');
    await user.type(screen.getByLabelText('Amount Paid'), '3.00');
    await user.click(screen.getByRole('button', { name: /calculate change/i }));
    await user.click(screen.getByRole('link', { name: /^settings$/i }));
    await user.clear(screen.getByLabelText('Trick Number'));
    await user.type(screen.getByLabelText('Trick Number'), '4');
    await user.click(screen.getByRole('button', { name: /save settings/i }));

    expect(localStorage.getItem('cash-register:trick-number')).toBe('4');
    expect(localStorage.getItem('cash-register:transaction-history')).not.toBeNull();

    await user.click(screen.getByRole('button', { name: /reset software/i }));

    expect(screen.getByText('Software reset.')).toBeInTheDocument();
    expect(screen.getByLabelText('Trick Number')).toHaveValue(3);
    await waitFor(() => {
      expect(localStorage.length).toBe(0);
    });

    await user.click(screen.getByRole('link', { name: /^calculator$/i }));

    expect(screen.getByLabelText('Amount Owed')).toHaveValue('');
    expect(screen.getByLabelText('Amount Paid')).toHaveValue('');
    expect(screen.getByText('No transaction calculated yet.')).toBeInTheDocument();
  });

  it('converts a non-USD amount paid before calculating change', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('link', { name: /^settings$/i }));
    await user.clear(screen.getByLabelText('EUR USD Equivalent'));
    await user.type(screen.getByLabelText('EUR USD Equivalent'), '2.00');
    await user.click(screen.getByRole('button', { name: /save settings/i }));

    await user.click(screen.getByRole('link', { name: /^calculator$/i }));
    await user.type(screen.getByLabelText('Amount Owed'), '2.12');
    await user.type(screen.getByLabelText('Amount Paid'), '1.50');
    await user.selectOptions(screen.getByLabelText('Amount Paid Currency'), 'EUR');

    expect(screen.getByText('Equivalent in USD: $3.00')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /calculate change/i }));

    expect(screen.getAllByText('$0.88').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('quarters');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('dime');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('pennies');
  });

  it('uses the selected base currency for equivalents and change calculations', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('link', { name: /^settings$/i }));
    await user.selectOptions(screen.getByLabelText('Base Currency'), 'EUR');

    expect(screen.getByLabelText('EUR EUR Equivalent')).toHaveValue(1);

    await user.click(screen.getByRole('button', { name: /save settings/i }));

    await waitFor(() => {
      expect(localStorage.getItem('cash-register:base-currency')).toBe('EUR');
    });

    await user.click(screen.getByRole('link', { name: /^calculator$/i }));
    await user.type(screen.getByLabelText('Amount Owed'), '2.12');
    await user.type(screen.getByLabelText('Amount Paid'), '3.00');
    await user.selectOptions(screen.getByLabelText('Amount Paid Currency'), 'USD');

    expect(screen.getByText('Equivalent in EUR: €2.78')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /calculate change/i }));

    expect(screen.getAllByText('€0.66').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('quarters');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('dime');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('nickel');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('penny');
  });

  it('applies the euro denominations preset and switches the base currency', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('link', { name: /^settings$/i }));
    await user.click(screen.getByRole('button', { name: /edit denominations/i }));
    await user.click(screen.getByRole('button', { name: /reset euro defaults/i }));

    expect(screen.getByText('Euro denominations restored.')).toBeInTheDocument();

    await waitFor(() => {
      expect(localStorage.getItem('cash-register:base-currency')).toBe('EUR');
    });

    const savedDenominations = JSON.parse(
      localStorage.getItem('cash-register:denominations') ?? '[]',
    );
    expect(savedDenominations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ cents: 50, singular: 'fifty-cent coin' }),
        expect.objectContaining({ cents: 2, singular: 'two-cent coin' }),
      ]),
    );

    await user.click(screen.getByRole('link', { name: /^calculator$/i }));
    await user.type(screen.getByLabelText('Amount Owed'), '2.12');
    await user.type(screen.getByLabelText('Amount Paid'), '3.00');
    await user.click(screen.getByRole('button', { name: /calculate change/i }));

    expect(screen.getAllByText('€0.88').length).toBeGreaterThan(0);
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('fifty-cent coin');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('twenty-cent coin');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('two-cent coin');
    expect(screen.getByLabelText('Change denomination breakdown')).not.toHaveTextContent('quarters');
  });

  it('excludes denominations disabled from settings and shows a change shortfall', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('link', { name: /^settings$/i }));
    await user.click(screen.getByLabelText('pennies enabled'));

    await user.click(screen.getByRole('link', { name: /^calculator$/i }));
    await user.type(screen.getByLabelText('Amount Owed'), '2.12');
    await user.type(screen.getByLabelText('Amount Paid'), '3.00');
    await user.click(screen.getByRole('button', { name: /calculate change/i }));

    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('quarters');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('dime');
    expect(screen.getByLabelText('Change denomination breakdown')).not.toHaveTextContent('pennies');
    expect(screen.getByText(/missing \$0\.03/i)).toBeInTheDocument();
    expect(screen.getByText('$0.85')).toBeInTheDocument();
  });

  it('adds a custom denomination with editable token styling', async () => {
    const user = userEvent.setup();
    const { container } = renderApp();

    await user.click(screen.getByRole('link', { name: /^settings$/i }));
    await user.click(screen.getByRole('button', { name: /edit denominations/i }));
    await user.click(screen.getByRole('button', { name: /^add$/i }));

    const singularInputs = screen.getAllByLabelText(/singular name/i);
    const pluralInputs = screen.getAllByLabelText(/plural name/i);
    const labelInputs = screen.getAllByLabelText(/token label/i);
    const primaryColorInputs = screen.getAllByLabelText(/primary color/i);

    await user.clear(singularInputs[singularInputs.length - 1]);
    await user.type(singularInputs[singularInputs.length - 1], 'duo coin');
    await user.clear(pluralInputs[pluralInputs.length - 1]);
    await user.type(pluralInputs[pluralInputs.length - 1], 'duo coins');
    await user.clear(labelInputs[labelInputs.length - 1]);
    await user.type(labelInputs[labelInputs.length - 1], '2x');
    fireEvent.change(primaryColorInputs[primaryColorInputs.length - 1], {
      target: { value: '#123456' },
    });

    await user.click(screen.getByRole('button', { name: /save denominations/i }));

    const savedDenominations = JSON.parse(
      localStorage.getItem('cash-register:denominations') ?? '[]',
    );
    expect(savedDenominations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          cents: 2,
          singular: 'duo coin',
          plural: 'duo coins',
          visual: expect.objectContaining({
            label: '2x',
            primaryColor: '#123456',
          }),
        }),
      ]),
    );

    await user.click(screen.getByRole('link', { name: /^calculator$/i }));
    await user.type(screen.getByLabelText('Amount Owed'), '0.98');
    await user.type(screen.getByLabelText('Amount Paid'), '1.00');
    await user.click(screen.getByRole('button', { name: /calculate change/i }));

    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('duo coin');
    expect(screen.getByLabelText('Change denomination breakdown')).toHaveTextContent('2c');
    expect(container.querySelector('.denomination-type .coin-svg')).toHaveStyle(
      '--token-primary: #123456',
    );
  });

  it('opens the about page from navigation', async () => {
    const user = userEvent.setup();
    renderApp();

    const aboutLink = screen.getByRole('link', { name: /^about$/i });
    expect(aboutLink).toHaveAttribute('href', '/about');

    await user.click(aboutLink);

    expect(screen.getByRole('heading', { name: /about cash register/i })).toBeInTheDocument();
    expect(screen.getByLabelText('About Cash Register')).toHaveTextContent('Functionality');
    expect(screen.getByLabelText('Code organization summary')).toHaveTextContent('src/pages');
    expect(screen.getByLabelText('About Cash Register')).toHaveTextContent('Testing');
  });

  it('renders a page directly from its URL route', () => {
    renderApp(['/history']);

    expect(screen.getByRole('heading', { name: /transaction history/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^history$/i })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
