ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS pk_card_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS fk_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS fk_status_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.boards DROP CONSTRAINT IF EXISTS pk_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.statuses DROP CONSTRAINT IF EXISTS pk_status_id CASCADE;

DROP TABLE IF EXISTs public.boards;
CREATE TABLE boards (
    id serial NOT NULL,
    title text
);

DROP TABLE IF EXISTs public.cards;
CREATE TABLE cards (
    id serial NOT NULL,
    board_id integer,
    title text,
    status_id integer,
    "order" integer
);

DROP TABLE IF EXISTs public.statuses;
CREATE TABLE statuses (
    id serial NOT NULL,
    title text
);



ALTER TABLE ONLY boards
    ADD CONSTRAINT pk_board_id PRIMARY KEY (id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT pk_card_id PRIMARY KEY (id);

ALTER TABLE ONLY statuses
    ADD CONSTRAINT pk_status_id PRIMARY KEY (id);

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES statuses(id);

DROP TABLE IF EXISTS public.board_status;
CREATE TABLE board_status(
    board_id INT REFERENCES public.boards (id) ON UPDATE CASCADE ON DELETE CASCADE,
    statuses_id INT REFERENCES public.statuses (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT board_status_pk PRIMARY KEY (board_id, statuses_id)
);

INSERT INTO boards VALUES (1, 'Board 1');
INSERT INTO boards VALUES (2, 'Board 2');

INSERT INTO statuses VALUES (0, 'new');
INSERT INTO statuses VALUES (1, 'in progress');
INSERT INTO statuses VALUES (2, 'testing');
INSERT INTO statuses VALUES (3, 'done');
INSERT INTO statuses VALUES (4, 'nowy stan');

INSERT INTO board_status VALUES (1, 0);
INSERT INTO board_status VALUES (1, 1);
INSERT INTO board_status VALUES (1, 2);
INSERT INTO board_status VALUES (1, 3);
INSERT INTO board_status VALUES (1, 4);

INSERT INTO board_status VALUES (2, 0);
INSERT INTO board_status VALUES (2, 1);
INSERT INTO board_status VALUES (2, 2);
INSERT INTO board_status VALUES (2, 3);

INSERT INTO cards VALUES (1, 1, 'new card 1', 0, 0);
INSERT INTO cards VALUES (2, 1, 'new card 2', 0, 1);
INSERT INTO cards VALUES (3, 1, 'in progress card', 1, 0);
INSERT INTO cards VALUES (4, 1, 'planning', 2, 0);
INSERT INTO cards VALUES (5, 1, 'done card 1', 3, 0);
INSERT INTO cards VALUES (6, 1, 'done card 1', 3, 1);
INSERT INTO cards VALUES (7, 2, 'new card 1', 0, 0);
INSERT INTO cards VALUES (8, 2, 'new card 2', 0, 1);
INSERT INTO cards VALUES (9, 2, 'in progress card', 1, 0);
INSERT INTO cards VALUES (10, 2, 'planning', 2, 0);
INSERT INTO cards VALUES (11, 2, 'done card 1', 3, 0);
INSERT INTO cards VALUES (12, 2, 'done card 1', 3, 1);
