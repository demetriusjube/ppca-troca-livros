package br.unb.ppca.trocalivros.troca.service;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.unb.ppca.trocalivros.domain.Troca;
import br.unb.ppca.trocalivros.troca.builder.TradeMaximizerResultBuilder;
import br.unb.ppca.trocalivros.troca.parser.TradeMaximizerResultParser;

@Service
public class TrocaService {

	@Autowired
	private TradeMaximizerResultBuilder tradeMaximizerResultBuilder;
	@Autowired
	private TradeMaximizerResultParser tradeMaximizerResultParser;

	@Transactional
	public Troca gerarTroca() {
		Instant inicio = Instant.now();
		String tradeMaximizerOutput = tradeMaximizerResultBuilder.build();
		Instant fim = Instant.now();
		return tradeMaximizerResultParser.createTrocaFromResult(tradeMaximizerOutput, inicio, fim);
	}
}
