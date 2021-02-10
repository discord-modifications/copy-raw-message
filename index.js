const { inject, uninject } = require('powercord/injector');
const { getModule, React } = require('powercord/webpack');
const { Plugin } = require('powercord/entities');
const { MenuItem } = getModule(['MenuGroup', 'MenuItem'], false);

module.exports = class CopyRawMessage extends Plugin {
   async startPlugin() {
      const MessageContextMenu = getModule(m => m.default && m.default.displayName === 'MessageContextMenu', false);

      inject('copy-raw-message', MessageContextMenu, 'default', ([props], res) => {
         const { message } = props;

         if (!message || !message.content) return res;

         res.props.children.splice(4, 0,
            React.createElement(MenuItem, {
               label: 'Copy Message',
               id: 'copy-raw-message',
               action: () => DiscordNative.clipboard.copy(message.content)
            })
         );

         return res;
      });
      MessageContextMenu.default.displayName = 'MessageContextMenu';
   }

   pluginWillUnload() {
      uninject('copy-raw-message');
   }
};