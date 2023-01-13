package br.unb.ppca.trocalivros.troca.exception;

public class NenhumaTrocaRealizadaException extends RuntimeException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6065672239943126564L;

	public NenhumaTrocaRealizadaException() {
		super("Não foi possível realizar nenhuma troca");
	}

}
