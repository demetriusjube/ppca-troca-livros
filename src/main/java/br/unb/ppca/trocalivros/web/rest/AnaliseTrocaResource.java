package br.unb.ppca.trocalivros.web.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.unb.ppca.trocalivros.troca.builder.TradeMaximizerInputBuilder;

@RestController
@RequestMapping("/api/analise-troca")
@Transactional

public class AnaliseTrocaResource {

	private final Logger log = LoggerFactory.getLogger(ItemDesejadoResource.class);

	@Autowired
	private TradeMaximizerInputBuilder tradeMaximizerInputBuilder;

	/**
	 * {@code GET  /item-desejados} : get all the itemDesejados.
	 *
	 * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
	 *         of itemDesejados in body.
	 */
	@GetMapping("/trocas-disponiveis")
	public String getTrocasDisponiveis() {
		log.debug("REST request to get trocas disponíveis no formato TM");
		return tradeMaximizerInputBuilder.build();
	}

}
