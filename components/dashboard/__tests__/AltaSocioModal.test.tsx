import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AltaSocioModal from '../AltaSocioModal';

vi.stubGlobal('fetch', vi.fn());

const defaultProps = {
  isOpen: true,
  onClose: vi.fn(),
  institutionId: '10',
  plans: [{ id: '1', membershipType: 'Mensual', price: '1000' }],
  token: 'mock-token',
  onSuccess: vi.fn(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('AltaSocioModal — renderizado', () => {
  it('no renderiza nada cuando isOpen es false', () => {
    render(<AltaSocioModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Alta de Socio')).not.toBeInTheDocument();
  });

  it('muestra el título cuando isOpen es true', () => {
    render(<AltaSocioModal {...defaultProps} />);
    expect(screen.getByText('Alta de Socio')).toBeInTheDocument();
  });

  it('muestra el input de búsqueda con placeholder correcto', () => {
    render(<AltaSocioModal {...defaultProps} />);
    expect(screen.getByPlaceholderText('Nombre o email...')).toBeInTheDocument();
  });

  it('muestra el placeholder del panel derecho cuando no hay usuario seleccionado', () => {
    render(<AltaSocioModal {...defaultProps} />);
    expect(screen.getByText('Seleccioná un socio')).toBeInTheDocument();
  });

  it('el botón "Inscribir socio" está disabled sin usuario seleccionado', () => {
    render(<AltaSocioModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: /inscribir socio/i })).toBeDisabled();
  });
});

describe('AltaSocioModal — búsqueda de usuarios', () => {
  it('no llama a fetch si se tipean menos de 2 caracteres', async () => {
    const user = userEvent.setup({ delay: null });
    render(<AltaSocioModal {...defaultProps} />);

    await user.type(screen.getByPlaceholderText('Nombre o email...'), 'a');
    await new Promise((r) => setTimeout(r, 500));

    expect(fetch).not.toHaveBeenCalled();
  });

  it('llama al endpoint correcto al escribir 2+ caracteres (debounce 350ms)', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [{ id: '1', email: 'juan@test.com', name: 'Juan Pérez' }],
    } as Response);

    const user = userEvent.setup({ delay: null });
    render(<AltaSocioModal {...defaultProps} />);

    await user.type(screen.getByPlaceholderText('Nombre o email...'), 'juan');

    await waitFor(
      () => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/institutions/10/users/search?q=juan'),
          expect.objectContaining({
            headers: expect.objectContaining({ Authorization: 'Bearer mock-token' }),
          }),
        );
      },
      { timeout: 1000 },
    );
  });

  it('muestra los resultados devueltos por la API', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [{ id: '1', email: 'juan@test.com', name: 'Juan Pérez' }],
    } as Response);

    const user = userEvent.setup({ delay: null });
    render(<AltaSocioModal {...defaultProps} />);

    await user.type(screen.getByPlaceholderText('Nombre o email...'), 'juan');

    await waitFor(() => expect(screen.getByText('Juan Pérez')).toBeInTheDocument(), { timeout: 1000 });
    expect(screen.getByText('juan@test.com')).toBeInTheDocument();
  });

  it('muestra "Sin resultados" cuando la API retorna array vacío', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    const user = userEvent.setup({ delay: null });
    render(<AltaSocioModal {...defaultProps} />);

    await user.type(screen.getByPlaceholderText('Nombre o email...'), 'xyz');

    await waitFor(() => expect(screen.getByText('Sin resultados')).toBeInTheDocument(), { timeout: 1000 });
  });
});

describe('AltaSocioModal — selección de usuario', () => {
  beforeEach(() => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [{ id: '1', email: 'maria@test.com', name: 'María García' }],
    } as Response);
  });

  it('pre-rellena el nombre al seleccionar un usuario del listado', async () => {
    const user = userEvent.setup({ delay: null });
    render(<AltaSocioModal {...defaultProps} />);

    await user.type(screen.getByPlaceholderText('Nombre o email...'), 'maria');
    await waitFor(() => expect(screen.getByText('María García')).toBeInTheDocument(), { timeout: 1000 });

    await user.click(screen.getByText('María García'));

    expect(screen.getByDisplayValue('María García')).toBeInTheDocument();
  });

  it('muestra el email del usuario seleccionado en el panel derecho', async () => {
    const user = userEvent.setup({ delay: null });
    render(<AltaSocioModal {...defaultProps} />);

    await user.type(screen.getByPlaceholderText('Nombre o email...'), 'maria');
    await waitFor(() => expect(screen.getByText('María García')).toBeInTheDocument(), { timeout: 1000 });

    await user.click(screen.getByText('María García'));

    expect(screen.getAllByText('maria@test.com').length).toBeGreaterThanOrEqual(1);
  });

  it('habilita el botón "Inscribir socio" después de seleccionar un usuario', async () => {
    const user = userEvent.setup({ delay: null });
    render(<AltaSocioModal {...defaultProps} />);

    await user.type(screen.getByPlaceholderText('Nombre o email...'), 'maria');
    await waitFor(() => expect(screen.getByText('María García')).toBeInTheDocument(), { timeout: 1000 });

    await user.click(screen.getByText('María García'));

    expect(screen.getByRole('button', { name: /inscribir socio/i })).not.toBeDisabled();
  });

  it('deseleccionar usuario vuelve a bloquear el botón y limpia el formulario', async () => {
    const user = userEvent.setup({ delay: null });
    render(<AltaSocioModal {...defaultProps} />);

    await user.type(screen.getByPlaceholderText('Nombre o email...'), 'maria');
    await waitFor(() => expect(screen.getByText('María García')).toBeInTheDocument(), { timeout: 1000 });

    await user.click(screen.getByText('María García'));
    await user.click(screen.getByText('Cambiar usuario'));

    expect(screen.getByRole('button', { name: /inscribir socio/i })).toBeDisabled();
    expect(screen.getByText('Seleccioná un socio')).toBeInTheDocument();
  });
});

describe('AltaSocioModal — submit', () => {
  beforeEach(() => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: '1', email: 'pedro@test.com', name: 'Pedro López' }],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({
          id: '1',
          role: 'viewer',
          userId: '1',
          dni: '12345678',
          fullName: 'Pedro López',
          status: 'pending',
          user: { id: '1', email: 'pedro@test.com', name: 'Pedro López' },
          membershipData: null,
        }),
      } as Response);
  });

  it('llama a onSuccess con el nuevo miembro tras un submit exitoso', async () => {
    const onSuccess = vi.fn();
    const user = userEvent.setup({ delay: null });
    render(<AltaSocioModal {...defaultProps} onSuccess={onSuccess} />);

    await user.type(screen.getByPlaceholderText('Nombre o email...'), 'pedro');
    await waitFor(() => expect(screen.getByText('Pedro López')).toBeInTheDocument(), { timeout: 1000 });
    await user.click(screen.getByText('Pedro López'));

    await user.clear(screen.getByPlaceholderText('Ej: 40123456'));
    await user.type(screen.getByPlaceholderText('Ej: 40123456'), '12345678');

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '1');

    await user.click(screen.getByRole('button', { name: /inscribir socio/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1), { timeout: 2000 });
    expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining({ role: 'viewer' }));
  });

  it('hace POST al endpoint correcto con los datos del formulario', async () => {
    const user = userEvent.setup({ delay: null });
    render(<AltaSocioModal {...defaultProps} />);

    await user.type(screen.getByPlaceholderText('Nombre o email...'), 'pedro');
    await waitFor(() => expect(screen.getByText('Pedro López')).toBeInTheDocument(), { timeout: 1000 });
    await user.click(screen.getByText('Pedro López'));

    await user.type(screen.getByPlaceholderText('Ej: 40123456'), '12345678');
    await user.selectOptions(screen.getByRole('combobox'), '1');
    await user.click(screen.getByRole('button', { name: /inscribir socio/i }));

    await waitFor(
      () => {
        const calls = vi.mocked(fetch).mock.calls;
        const postCall = calls.find((c) => c[1]?.method === 'POST');
        expect(postCall).toBeDefined();
        const body = JSON.parse(postCall![1]!.body as string);
        expect(body).toMatchObject({
          email: 'pedro@test.com',
          dni: '12345678',
          membershipDataId: 1,
        });
      },
      { timeout: 2000 },
    );
  });
});
