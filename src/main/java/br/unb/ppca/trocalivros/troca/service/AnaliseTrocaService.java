package br.unb.ppca.trocalivros.troca.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.unb.ppca.trocalivros.domain.ItemDesejado;
import br.unb.ppca.trocalivros.domain.ItemTroca;
import br.unb.ppca.trocalivros.domain.User;
import br.unb.ppca.trocalivros.domain.enumeration.SituacaoItem;
import br.unb.ppca.trocalivros.repository.ItemDesejadoRepository;
import br.unb.ppca.trocalivros.repository.ItemTrocaRepository;

@Service
@Transactional
public class AnaliseTrocaService {

	@Autowired
	private ItemTrocaRepository itemTrocaRepository;

	@Autowired
	private ItemDesejadoRepository itemDesejadoRepository;

	public List<ItemTroca> buscarItensTrocaDisponiveis() {
		return itemTrocaRepository.findBySituacaoEqualsAndUserIsNotNull(SituacaoItem.DISPONIVEL);
	}

	public List<ItemDesejado> buscarItensDesejadosDoUsuario(User user) {
		return itemDesejadoRepository.findByUserEqualsAndSituacaoEquals(user, SituacaoItem.DISPONIVEL);

	}

}
