package br.unb.ppca.trocalivros.troca.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.unb.ppca.trocalivros.domain.ItemDesejado;
import br.unb.ppca.trocalivros.domain.ItemTroca;
import br.unb.ppca.trocalivros.domain.User;
import br.unb.ppca.trocalivros.domain.enumeration.SituacaoItem;
import br.unb.ppca.trocalivros.repository.ItemDesejadoRepository;
import br.unb.ppca.trocalivros.repository.ItemTrocaRepository;

@Service
public class TrocaService {
	
	@Autowired
	private ItemTrocaRepository itemTrocaRepository;
	
	@Autowired
	private ItemDesejadoRepository itemDesejadoRepository;
	
	public List<ItemTroca> buscarItensTrocaDisponiveis(){
		return itemTrocaRepository.findBySituacaoEquals(SituacaoItem.DISPONIVEL);
	}
	
	public List<ItemDesejado> buscarItensDesejadosDoUsuario(User user){
		return itemDesejadoRepository.findByUserEqualsAndSituacaoEquals(user, SituacaoItem.DISPONIVEL);
		
	}

}
