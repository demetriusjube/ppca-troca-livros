package br.unb.ppca.trocalivros.repository;

import br.unb.ppca.trocalivros.domain.RegistroTroca;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the RegistroTroca entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RegistroTrocaRepository extends JpaRepository<RegistroTroca, Long> {}
