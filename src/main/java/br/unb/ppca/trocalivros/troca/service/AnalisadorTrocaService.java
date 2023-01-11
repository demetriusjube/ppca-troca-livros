package br.unb.ppca.trocalivros.troca.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.unb.ppca.trocalivros.domain.ItemTroca;
import br.unb.ppca.trocalivros.domain.User;

@Service
public class AnalisadorTrocaService {
	
	@Autowired
	private TrocaService trocaService;

	/**
	 * Verifica na base as possibilidades de troca para fornecer uma sugestão
	 * @return
	 */
	public String analisar() {
		StringBuilder resultado = new StringBuilder();
		List<ItemTroca> itensTrocaDisponiveis = trocaService.buscarItensTrocaDisponiveis();
		Map<User, List<ItemTroca>> itensPorUsuario = itensTrocaDisponiveis.stream().collect(Collectors.groupingBy(ItemTroca::getUser));
		return resultado.toString();
	}
}
