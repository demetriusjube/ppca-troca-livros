package br.unb.ppca.trocalivros.troca.builder;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.unb.ppca.trocalivros.domain.ItemTroca;
import br.unb.ppca.trocalivros.domain.User;
import br.unb.ppca.trocalivros.troca.service.TrocaConstants;
import br.unb.ppca.trocalivros.troca.service.AnaliseTrocaService;

@Component
public class TradeMaximizerInputBuilder {

	@Autowired
	private AnaliseTrocaService trocaService;

	@Autowired
	private UserItemTrocaBuilder userItemTrocaBuilder;

	public String build() {
		return build(true);
	}
	
	public String build(boolean somenteResultado) {
		StringBuilder resultado = new StringBuilder();
		resultado.append(TrocaConstants.CONFIG_PADRAO);
		if (somenteResultado) {
			resultado.append(TrocaConstants.SEPARADOR_TROCA);
			resultado.append(TrocaConstants.OPCOES_SOMENTE_RESULTADO);
		}
		resultado.append(TrocaConstants.SEPARADOR_NOVA_LINHA);
		List<ItemTroca> itensTrocaDisponiveis = trocaService.buscarItensTrocaDisponiveis();
		Map<User, List<ItemTroca>> itensPorUsuario = itensTrocaDisponiveis.stream()
				.collect(Collectors.groupingBy(ItemTroca::getUser));
		for (Entry<User, List<ItemTroca>> itensTrocaUsuario : itensPorUsuario.entrySet()) {
			String linhasTrocaUsuario = userItemTrocaBuilder.build(itensTrocaUsuario.getKey(),
					itensTrocaUsuario.getValue());
			if (StringUtils.isNotBlank(linhasTrocaUsuario)) {
				resultado.append(linhasTrocaUsuario);
				resultado.append(TrocaConstants.SEPARADOR_NOVA_LINHA);
			}
		}
		return resultado.toString();

	}
}
