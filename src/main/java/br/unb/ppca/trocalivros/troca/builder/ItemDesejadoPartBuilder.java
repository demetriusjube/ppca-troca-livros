package br.unb.ppca.trocalivros.troca.builder;

import java.util.List;

import org.apache.commons.collections4.CollectionUtils;

import br.unb.ppca.trocalivros.domain.ItemDesejado;
import br.unb.ppca.trocalivros.troca.service.TrocaConstants;

public class ItemDesejadoPartBuilder {
	
	public static String build(List<ItemDesejado> itensDesejados) {
		StringBuilder itensDesejadosPart = new StringBuilder();
		if (CollectionUtils.isNotEmpty(itensDesejados)) {
			for (ItemDesejado itemDesejado : itensDesejados) {
				itensDesejadosPart.append(itemDesejado.getIdGlobal());
				itensDesejadosPart.append(TrocaConstants.SEPARADOR_TROCA);
			}
		}
		return itensDesejadosPart.toString().trim();
	}

}
