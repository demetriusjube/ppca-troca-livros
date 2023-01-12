package br.unb.ppca.trocalivros.troca.parser;

import java.util.List;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.unb.ppca.trocalivros.domain.ItemTroca;
import br.unb.ppca.trocalivros.domain.RegistroTroca;
import br.unb.ppca.trocalivros.domain.enumeration.SituacaoItem;
import br.unb.ppca.trocalivros.repository.ItemTrocaRepository;
import br.unb.ppca.trocalivros.troca.service.TrocaConstants;

@Component
public class RegistroTrocaParser {

	@Autowired
	private ItemTrocaRepository itemTrocaRepository;

	private static final int QUANTIDADE_EXATA_ITENS_ARRAY = 2;

	public RegistroTroca parseRegistroTrocaFromResult(String linhaRegistroTroca) {
		RegistroTroca registroTroca = new RegistroTroca();
		registroTroca.setAceite(false);
		String[] itensRegistroTroca = getArrayFromString(linhaRegistroTroca, TrocaConstants.TOKEN_RECEIVES);
		preencheDadosOrigem(registroTroca, itensRegistroTroca);
		preencheDadosDestino(registroTroca, itensRegistroTroca);
		return registroTroca;
	}

	public void preencheDadosDestino(RegistroTroca registroTroca, String[] itensRegistroTroca) {
		String destino = itensRegistroTroca[0];
		ItemTroca itemTrocaDestino = getItemTrocaFromString(destino);
		registroTroca.setDestino(itemTrocaDestino);
	}

	public void preencheDadosOrigem(RegistroTroca registroTroca, String[] itensRegistroTroca) {
		String origem = itensRegistroTroca[1];
		ItemTroca itemTrocaOrigem = getItemTrocaFromString(origem);
		registroTroca.setOrigem(itemTrocaOrigem);
	}

	private ItemTroca getItemTrocaFromString(String valor) {
		ItemUserDto itemUser = parseItemUser(valor);
		List<ItemTroca> itensTroca = itemTrocaRepository
				.findByIdGlobalEqualsAndUserLoginEqualsIgnoreCaseAndSituacaoEqualsOrderByIdAsc(itemUser.idGlobal,
						itemUser.user, SituacaoItem.DISPONIVEL);
		if (CollectionUtils.isEmpty(itensTroca)) {
			throw new IllegalArgumentException("Não foi possível encontrar o ItemTroca do valor " + valor);
		}
		return itensTroca.stream().findFirst().get();
	}

	private ItemUserDto parseItemUser(String itemUser) {
		ItemUserDto itemUserDto = new ItemUserDto();
		String token = TrocaConstants.FIM_SEPARADOR_USUARIO;
		String[] itemUserArray = getArrayFromString(itemUser, token);
		itemUserDto.user = itemUserArray[0].replace(TrocaConstants.INICIO_SEPARADOR_USUARIO, "").trim();
		itemUserDto.idGlobal = itemUserArray[1].trim();
		return itemUserDto;
	}

	public String[] getArrayFromString(String itemUser, String token) {
		String[] itemUserArray = itemUser.split(token);
		if (isArrayPossuiQuantidadeMinimaValida(itemUserArray)) {
			throw new IllegalArgumentException(
					"O valor " + itemUser + " não pode ser dividido corretamente com o token '" + token + "'!");
		}
		return itemUserArray;
	}

	private boolean isArrayPossuiQuantidadeMinimaValida(String[] itemUserArray) {
		return itemUserArray.length != QUANTIDADE_EXATA_ITENS_ARRAY;
	}

	private class ItemUserDto {
		private String user;
		private String idGlobal;
	}
}
