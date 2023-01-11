package br.unb.ppca.trocalivros.troca.builder;

import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.stereotype.Component;

import br.unb.ppca.trocalivros.domain.ItemDesejado;
import br.unb.ppca.trocalivros.domain.User;
import br.unb.ppca.trocalivros.troca.service.TrocaConstants;

@Component
public class DummyItemPartBuilder {

	/**
	 * Cria uma lista dos itens desejados na forma de Dummy Itens, de forma a
	 * impedir itens duplicados
	 * https://github.com/chrisokasaki/TradeMaximizer#protection-from-duplicate-items
	 * 
	 * @param user
	 * @param itensDesejados
	 * @return
	 */
	public static String build(User user, List<ItemDesejado> itensDesejados) {
		StringBuilder dummyItens = new StringBuilder();
		if (CollectionUtils.isNotEmpty(itensDesejados)) {
			dummyItens.append(UserPartBuilder.build(user));
			dummyItens.append(TrocaConstants.DUMMY_ID);
			dummyItens.append(TrocaConstants.SEPARADOR_OFERTA_TROCA);
			dummyItens.append(ItemDesejadoPartBuilder.build(itensDesejados));
		}
		return dummyItens.toString().trim();
	}
}
