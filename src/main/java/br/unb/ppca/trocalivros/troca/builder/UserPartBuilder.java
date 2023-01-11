package br.unb.ppca.trocalivros.troca.builder;

import br.unb.ppca.trocalivros.domain.User;
import br.unb.ppca.trocalivros.troca.service.TrocaConstants;

public class UserPartBuilder {

	public static String build(User user) {
		StringBuilder userPart = new StringBuilder();
		userPart.append(TrocaConstants.INICIO_SEPARADOR_USUARIO);
		userPart.append(user.getLogin());
		userPart.append(TrocaConstants.FIM_SEPARADOR_USUARIO);
		userPart.append(TrocaConstants.SEPARADOR_TROCA);
		return userPart.toString();

	}
}
