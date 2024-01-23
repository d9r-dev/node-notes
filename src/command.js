import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { findNotes, getAllNotes, removeAllNotes, newNote, removeNote } from './notes.js';
import { listNotes } from './utils.js';
import { log } from 'console';
import { start } from './server.js';

yargs(hideBin(process.argv))
  .command('new <note>', 'add a new note', (yargs) => {
    return yargs.positional('note', {
      type: 'string',
      description: 'The content of the note to create',
    })
  },
    async (argv) => {
      const tags = argv.tags ? argv.tags.split(',') : [];
      await newNote(argv.note, tags);
      console.log('New note!', argv.note);
    })
  .option('tags', {
    alias: 't',
    type: 'string',
    description: 'tags to add to the notgs to add to the note'
  })
  .command('all', 'get all notes', () => { }, async () => { 
    const notes = await getAllNotes()
    listNotes(notes);
  })
  .command('find <filter>', 'get matching notes', yargs => {
    return yargs.positional('filter', {
      describe: 'The search term to filter notes by, will be applied to note.content',
      type: 'string'
    })
  }, async (argv) => {
      const filteredNotes = await findNotes(argv.filter);
      listNotes(filteredNotes);
    })
  .command('remove <id>', 'remove a note by id', yargs => {
    return yargs.positional('id', {
      type: 'number',
      description: 'The id of the note you want to remove'
    })
  }, async (argv) => {
      const id = await removeNote(argv.id);
      log("deleted note with id: ", id);
    })
  .command('web [port]', 'launch website to see notes', yargs => {
    return yargs
      .positional('port', {
        describe: 'port to bind on',
        default: 5000,
        type: 'number'
      })
  }, async (argv) => {
      const notes = await getAllNotes();
      start(notes, argv.port);
    })
  .command('clean', 'remove all notes', () => { }, async (argv) => { 
    await removeAllNotes();
    log('db reseted!');
  })
  .demandCommand(1).parse();


