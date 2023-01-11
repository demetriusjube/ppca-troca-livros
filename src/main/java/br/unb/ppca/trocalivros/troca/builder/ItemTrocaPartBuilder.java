package br.unb.ppca.trocalivros.troca.builder;

import java.util.List;

import br.unb.ppca.trocalivros.domain.ItemDesejado;
import br.unb.ppca.trocalivros.domain.ItemTroca;
import br.unb.ppca.trocalivros.domain.User;
import br.unb.ppca.trocalivros.troca.service.TrocaConstants;

public class ItemTrocaPartBuilder {

	public static String buildDummy(User user, ItemTroca itemTroca) {
		StringBuilder itemTrocaBuilder = initBuilder(user);
		itemTrocaBuilder.append(TrocaConstants.DUMMY_ID);
		return itemTrocaBuilder.toString();
	}

	public static StringBuilder initBuilder(User user) {
		StringBuilder itemTrocaBuilder = new StringBuilder();
		itemTrocaBuilder.append(UserPartBuilder.build(user));
		itemTrocaBuilder.append(TrocaConstants.SEPARADOR_OFERTA_TROCA);
		return itemTrocaBuilder;
	}

	public static String build(User user, ItemTroca itemTroca, List<ItemDesejado> itensDesejados) {
		StringBuilder itemTrocaBuilder = initBuilder(user);
		itemTrocaBuilder.append(ItemDesejadoPartBuilder.build(itensDesejados));
		return itemTrocaBuilder.toString();
	}

}
