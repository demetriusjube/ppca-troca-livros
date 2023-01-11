package br.unb.ppca.trocalivros.troca.builder;

import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.unb.ppca.trocalivros.domain.ItemDesejado;
import br.unb.ppca.trocalivros.domain.ItemTroca;
import br.unb.ppca.trocalivros.domain.User;
import br.unb.ppca.trocalivros.troca.service.TrocaConstants;
import br.unb.ppca.trocalivros.troca.service.AnaliseTrocaService;

@Component
public class UserItemTrocaBuilder {

	@Autowired
	private AnaliseTrocaService trocaService;

	public String build(User user, List<ItemTroca> itensTrocaDisponiveis) {
		StringBuilder itensTrocaUsuario = new StringBuilder();
		if (CollectionUtils.isNotEmpty(itensTrocaDisponiveis)) {
			List<ItemDesejado> itensDesejadosDoUsuario = trocaService.buscarItensDesejadosDoUsuario(user);
			if (CollectionUtils.isNotEmpty(itensDesejadosDoUsuario)) {
				montaItensTrocaUsuario(user, itensTrocaDisponiveis, itensTrocaUsuario, itensDesejadosDoUsuario);
			}
		}
		return itensTrocaUsuario.toString();
	}

	private void montaItensTrocaUsuario(User user, List<ItemTroca> itensTrocaDisponiveis,
			StringBuilder itensTrocaUsuario, List<ItemDesejado> itensDesejadosDoUsuario) {
		if (existeApenasUmItemDeTroca(itensTrocaDisponiveis)) {
			ItemTroca itemTroca = itensTrocaDisponiveis.stream().findFirst().get();
			itensTrocaUsuario.append(ItemTrocaPartBuilder.build(user, itemTroca, itensDesejadosDoUsuario));
		} else {
			montaItensDeTrocaComDummy(user, itensTrocaDisponiveis, itensTrocaUsuario, itensDesejadosDoUsuario);
		}
	}

	public void montaItensDeTrocaComDummy(User user, List<ItemTroca> itensTrocaDisponiveis,
			StringBuilder itensTrocaUsuario, List<ItemDesejado> itensDesejadosDoUsuario) {
		for (ItemTroca itemTroca : itensTrocaDisponiveis) {
			itensTrocaUsuario.append(ItemTrocaPartBuilder.buildDummy(user, itemTroca));
			itensTrocaUsuario.append(TrocaConstants.SEPARADOR_NOVA_LINHA);
		}
		itensTrocaUsuario.append(DummyItemPartBuilder.build(user, itensDesejadosDoUsuario));
	}

	public boolean existeApenasUmItemDeTroca(List<ItemTroca> itensTrocaDisponiveis) {
		return itensTrocaDisponiveis.size() == 1;
	}
}
